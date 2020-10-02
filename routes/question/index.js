var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var { SellModel, QuestionsModel, CommentsModel, UserModel } = require('../../db/models')
var JwtUtil = require('../../utils/jwt')
var url = require('../../utils/url')
var defaultAvatarUrl = require('../../utils/defaultAvatarUrl')
var defaultName = '此用户已注销'

//获取问题发布者的头像和回复数量
const getAvatarAndcommentsNum = async (userId, questionId) => {
  const res1 = await UserModel.findOne({ _id: userId })
  const res2 = await CommentsModel.countDocuments({ questionId })
  const {
    avatar = defaultAvatarUrl,
    name = defaultName,
    userName = defaultName,
  } = res1 || {}
  return {
    avatar,
    name,
    userName,
    nums: res2,
  }
}

//根据userId获取头像和昵称
const getAvatarAndName = async (userId, targetUserId) => {
  const res = await UserModel.findOne({ _id: userId })
  const {
    avatar,
    name,
    userName
  } = res || {}
  if (targetUserId) {
    const res2 = await UserModel.findOne({ _id: targetUserId })
    const {
      avatar: targetAvatar,
      name: targetName,
      userName: targetUserName
    } = res2 || {}
    return {
      avatar: avatar || defaultAvatarUrl,
      name: name || defaultName,
      userName: name || defaultName,
      targetAvatar: targetAvatar || defaultAvatarUrl,
      targetName: targetName || defaultName,
      targetUserName: targetUserName || defaultName,
    }
  }
  return {
    avatar: avatar || defaultAvatarUrl,
    name: name || defaultName,
    userName: name || defaultName,
    targetAvatar: null,
    targetName: null,
    targetUserName: null,
  }
}

//获取问题的详情和一级评论
const getDetailAndLevelOneComments = async (questionId, pageSize, currentPage) => {
  const res1 = await QuestionsModel.findOne({ _id: questionId })//问题详情
  const {
    _id,
    userId,
    title,
    description,
    imgs,
    createTime,
  } = res1
  const res2 = await getAvatarAndName(userId)//发布者头像和昵称
  const { avatar, name, userName } = res2
  const total = await CommentsModel.countDocuments({ questionId, parentCommentId: null })//总数
  const totalPage = Math.ceil(total / pageSize)//总页数
  const skipCount = parseInt((currentPage - 1) * pageSize)//分页跳过条数
  const res3 = await CommentsModel.find({ questionId, parentCommentId: null })//回复列表
    .limit(pageSize)
    .skip(skipCount)
  return {
    detail: {
      _id,
      userId,
      title,
      description,
      imgs,
      createTime,
      avatar,
      name,
      userName,
    },
    comments: res3,
    total,
    totalPage,
    currentPage,
    pageSize,
  }
}

//根据问题Id和评论id获取子评论
const getChildComments = async (questionId, parentCommentId) => {
  const res = await CommentsModel.find({ questionId, parentCommentId })
  return res
}

//根据问题Id和评论id获取子评论个数
const getChildCommentsNums = async (questionId, parentCommentId) => {
  const res = await CommentsModel.countDocuments({ questionId, parentCommentId })
  return res
}

//获取头像昵称和子评论个数
const getAvatarAndNameAndChildCommentsNums = async (userId, questionId, parentCommentId) => {
  const res1 = await getAvatarAndName(userId)
  const res2 = await getChildCommentsNums(questionId, parentCommentId)
  return {
    avatarAndName: res1,
    childCommentsNums: res2
  }
}

/**
 * 获取问题列表 (分页)ok
 * 思路：先查询问题表，拿到_id和userId后，分别去评论表和用户表获取评论数量和头像
 */
router.get('/getQuestionList', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    let {
      keyword = "",
      currentPage = 1,
      pageSize = 8,
    } = req.query;
    keyword = String(keyword)
    currentPage = Number(currentPage)
    pageSize = Number(pageSize)
    let total = 0//总数
    let totalPage = 0//总页数
    let skipCount = parseInt((currentPage - 1) * pageSize)//分页跳过条数
    const _filter = {
      $or: [  // 多字段同时匹配
        { title: { $regex: keyword } },
        { description: { $regex: keyword, $options: '$i' } }, //  $options: '$i' 忽略大小写
      ]
    }
    QuestionsModel.countDocuments(_filter, (err, doc) => { // 查询总条数（用于分页）
      if (err) {
        res.send({ code: 1, msg: '获取失败', data: err })
      } else {
        total = doc
        totalPage = Math.ceil(doc / pageSize)
      }
    })
    QuestionsModel.find(_filter).limit(pageSize) // 最多显示pageSize条
      .sort({ 'createTime': -1 }) // 倒序
      .skip(skipCount)//分页跳过条数
      .exec((err, doc) => { // 回调
        if (err) {
          res.send({ code: 1, msg: '获取失败', data: err })
        }
        if (Array.isArray(doc)) {
          // 获取头像
          const promiseArr = []
          doc.forEach(item => {
            const { userId, _id } = item
            promiseArr.push(
              getAvatarAndcommentsNum(userId, _id)
            )
          })
          Promise.all(promiseArr).then(resArr => {
            const list = doc.map((item, index) => {
              const { avatar, nums, name, userName } = resArr[index]
              const {
                _id,
                userId,
                title,
                description,
                imgs,
                createTime,
              } = item
              return {
                _id,
                userId,
                title,
                description,
                imgs,
                createTime,
                avatar,
                name,
                userName,
                commentsNum: nums,
              }
            })
            const data = {
              list,
              total,
              totalPage,
              currentPage,
              pageSize,
            }
            res.send({ code: 0, data, msg: '获取成功' })
          })
        } else {
          res.send({ code: 1, msg: '获取失败' })
        }
      })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//发布问题ok
router.post('/add', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    const form = new formidable.IncomingForm();
    form.uploadDir = '././public/images'
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.send({ code: 1, msg: '发布失败！', data: err })
      } else {
        const {
          title,
          description,
        } = fields
        const imgArr = Object.keys(files)
        const imgs = imgArr.map((key, index) => {
          let src = files[key].path
          src = src.replace("public", "")
          src = src.replace("\\", "/")
          src = src.replace("\\", "/")
          src = `${url}${src}`
          let id = files[key].path
          return {
            id,
            src
          }
        })
        console.log(description)
        new QuestionsModel({
          userId,
          createTime: new Date().valueOf(),
          title,
          description,
          imgs,
        }).save((err, data) => {
          if (err) {
            res.send({ code: 1, msg: '发布失败！', data: err })
          } else {
            res.send({ code: 0, msg: '发布成功！' })
          }
        })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//评论回复ok
router.post('/comment', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    const {
      targetUserId,//targetUserId
      commentId,//parentId
      parentCommentId,//parentCommentId
      questionId,//questionId
      content,//content
    } = req.body
    new CommentsModel({
      targetUserId,
      parentId: commentId,
      parentCommentId,
      createTime: new Date().valueOf(),
      questionId,
      userId,
      content,
    }).save((err, data) => {
      if (err) {
        res.send({ code: 1, msg: '评论失败！', data: err })
      } else {
        res.send({ code: 0, msg: '评论成功！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
});

//获取问题详情
router.get('/getDetail', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
      currentPage = 1,
      pageSize = 8,
    } = req.query
    getDetailAndLevelOneComments(_id, pageSize, currentPage).then(resData => {
      const { comments, detail, ...pagination } = resData
      const promiseArr = []
      comments.forEach((item, index) => {
        const { userId, questionId, _id } = item
        promiseArr.push(
          getAvatarAndNameAndChildCommentsNums(userId, questionId, _id)
        )
      })
      Promise.all(promiseArr).then(resArr => {
        const newComments = []
        resArr.forEach((item, index) => {
          const { avatarAndName, childCommentsNums } = item
          const {
            avatar,
            name,
            userName,
          } = avatarAndName
          const {
            _id,
            questionId,
            userId,
            targetUserId,
            parentId,
            parentCommentId,
            content,
            createTime,
          } = comments[index]
          newComments.push({
            _id,
            questionId,
            userId,
            targetUserId,
            parentId,
            parentCommentId,
            content,
            createTime,
            avatar,
            name,
            userName,
            childCommentsNums,
          })
        })
        const data = {
          detail,
          comments: newComments,
          ...pagination,
        }
        res.send({ code: 0, msg: '获取成功!', data })
      })
    }).catch(err => {
      res.send({ code: 1, msg: '获取详情失败！', data: err })
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
});

//获取子评论
router.get('/getChildComments', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      questionId,
      parentCommentId,
    } = req.query
    getChildComments(questionId, parentCommentId).then(list => {
      const promiseArr = []
      list.forEach((item) => {
        const { userId, targetUserId } = item
        promiseArr.push(getAvatarAndName(userId, targetUserId))
      })
      Promise.all(promiseArr).then(resArr => {
        const newList = list.map((item, index) => {
          const {
            avatar,
            name,
            userName,
            targetAvatar,
            targetName,
            targetUserName,
          } = resArr[index]
          const {
            _id,
            questionId,
            userId,
            targetUserId,
            parentId,
            parentCommentId,
            content,
            createTime,
          } = item
          return {
            _id,
            questionId,
            userId,
            targetUserId,
            parentId,
            parentCommentId,
            content,
            createTime,
            avatar,
            name,
            userName,
            targetAvatar,
            targetName,
            targetUserName,
          }
        })
        res.send({ code: 0, msg: '获取成功!', data: newList })
      })
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
});

//删除
router.post('/remove', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
    } = req.body
    QuestionsModel.findByIdAndRemove(_id, (err, doc) => {
      if (err) {
        res.send({ code: 1, msg: '删除失败!', data: err })
      }
      if (doc) {
        res.send({ code: 0, msg: '删除成功!' })
      } else {
        res.send({ code: 1, msg: '删除失败!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

// //修改
// router.post('/update', (req, res) => {
//   //验证token是否失效
//   const { token } = req.headers
//   const jwt = new JwtUtil(token)
//   const jwtResult = jwt.verifyToken()
//   if (jwtResult) {
//     const {
//       _id,
//       title,
//       content,
//       img,
//       href,
//       tags,
//     } = req.body
//     const params = {
//       title,
//       content,
//       img,
//       href,
//       tags,
//     }
//     SellModel.findByIdAndUpdate({ _id }, params, (err, old) => {
//       if (err) {
//         res.send({ code: 1, msg: '修改失败！', data: err })
//       }
//       if (old) {
//         res.send({ code: 1, msg: '修改成功！' })
//       } else {
//         res.send({ code: 1, msg: '修改失败！' })
//       }
//     })
//   } else {
//     res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
//   }
// })

module.exports = router;
