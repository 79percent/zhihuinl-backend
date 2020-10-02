var express = require('express');
var router = express.Router();
var { ArticleModel } = require('../../db/models')
var JwtUtil = require('../../utils/jwt')
var url = require('../../utils/url')
var formidable = require('formidable')

//获取所有文章 (分页)
router.get('/getArticles', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    let {
      keyword = "",
      currentPage = 1,
      pageSize = 5,
    } = req.query
    keyword = String(keyword)
    currentPage = Number(currentPage)
    pageSize = Number(pageSize)
    let total = 0//总数
    let totalPage = 0//总页数
    let skipCount = parseInt((currentPage - 1) * pageSize)//分页跳过条数
    const _filter = {
      $or: [  // 多字段同时匹配
        { title: { $regex: keyword } },
        { content: { $regex: keyword, $options: '$i' } }, //  $options: '$i' 忽略大小写
        { tags: { $regex: keyword, $options: '$i' } }
      ]
    }
    ArticleModel.countDocuments(_filter, (err, doc) => { // 查询总条数（用于分页）
      if (err) {
        res.send({ code: 1, msg: '获取信息失败', data: err })
      } else {
        total = doc
        totalPage = Math.ceil(doc / pageSize)
      }
    })
    ArticleModel.find(_filter).limit(pageSize) // 最多显示pageSize条
      .sort({ 'createTime': -1 }) // 倒序
      .skip(skipCount)//分页跳过条数
      .exec((err, doc) => { // 回调
        if (err) {
          res.send({ code: 1, msg: '获取信息失败', data: err })
        }
        if (doc) {
          const data = {
            list: doc,
            total,
            totalPage,
            currentPage,
            pageSize,
          }
          res.send({ code: 0, data, msg: '获取信息成功' })
        } else {
          res.send({ code: 1, msg: '获取信息失败' })
        }
      })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//添加文章
router.post('/addArticle', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    const createTime = new Date().valueOf()
    const form = new formidable.IncomingForm();
    form.uploadDir = '././public/images'
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.send({ code: 1, msg: '发布失败！', data: err })
      } else {
        const {
          title,
          content,
          href,
          tags,
        } = fields;
        let src = files.img.path
        src = src.replace("public", "")
        src = src.replace("\\", "/")
        src = src.replace("\\", "/")
        src = `${url}${src}`
        new ArticleModel({
          providerId: userId,
          title,
          content,
          img: src,
          href,
          tags,
          createTime,
        }).save((err, article) => {
          if (err) {
            res.send({ code: 1, msg: '添加失败!' })
          }
          if (article) {
            res.send({ code: 0, msg: '添加成功!' })
          } else {
            res.send({ code: 1, msg: '添加失败!' })
          }
        })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})


//删除文章
router.post('/removeArticle', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
    } = req.body
    ArticleModel.findByIdAndRemove(_id, (err, applyjob) => {
      if (err) {
        res.send({ code: 1, msg: '删除失败!', data: err })
      }
      if (applyjob) {
        res.send({ code: 0, msg: '删除成功!' })
      } else {
        res.send({ code: 1, msg: '删除失败,未找到该文章!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//修改文章
router.post('/updateArticle', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
      ...params
    } = req.body
    ArticleModel.findByIdAndUpdate({ _id }, params, (err, old) => {
      if (err) {
        res.send({ code: 1, msg: '修改失败！', data: err })
      }
      if (old) {
        res.send({ code: 0, msg: '修改成功！' })
      } else {
        res.send({ code: 1, msg: '修改失败，未找到该文章！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取文章详情的路由
router.get('/getArticleDetail', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const { _id } = req.query
    ArticleModel.findOne({ _id }, (err, article) => {
      if (err) {
        res.send({ code: 1, msg: '获取详情失败！', data: err })
      }
      if (article) {
        res.send({ code: 0, msg: '获取详情成功!', data: article })
      } else {
        res.send({ code: 1, msg: '获取详情失败,未找到该文章！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

module.exports = router;
