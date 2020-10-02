var express = require('express');
var formidable = require('formidable')
var path = require('path')
var router = express.Router();
var { UserModel } = require('../../db/models')
var JwtUtil = require('../../utils/jwt')
var url = require('../../utils/url')

//注册ok
router.post('/register', (req, res) => {
  const {
    userName,
    password,
    mobile: phone,
  } = req.body
  if (userName && password && phone) {
    UserModel.findOne({ userName }, (err, user) => {
      if (user) {
        res.send({ code: 1, msg: '此用户已存在' })
      } else {
        new UserModel({
          userName,
          password,
          phone,
          type: 'user',
        }).save((err, user) => {
          const { _id, type } = user
          //生成一个token
          let jwt = new JwtUtil(_id)
          let token = jwt.generateToken()
          const data = {
            userId: _id,
            type,
            token,
          }
          res.send({ code: 0, msg: '注册成功', data: data })
        })
      }
    })
  } else {
    res.send({ code: 1, msg: '请输入用户、密码和手机号' })
  }
})

//登录ok
router.post('/login', (req, res) => {
  const {
    userName,
    password,
  } = req.body
  if (userName && password) {
    //如果是用户名和密码登录
    UserModel.findOne({ userName, password }, (err, user) => {
      if (err) {
        res.send({ code: 1, msg: err })
      }
      if (user) {
        const { _id, type } = user
        //生成一个token
        let jwt = new JwtUtil(_id)
        let token = jwt.generateToken()
        const data = {
          userId: _id,
          type,
          token,
        }
        res.send({ code: 0, msg: '登录成功!', data })
      } else {
        res.send({ code: 1, msg: '用户名或密码不正确' })
      }
    })
  } else {
    res.send({ code: 1, msg: '请输入用户名和密码' })
  }
})

//获取当前用户信息ok 
router.get('/getCurrentUserInfo', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    UserModel.findOne({ _id: userId }, (err, user) => {
      if (err) {
        res.send({ code: 1, msg: err })
      }
      if (user) {
        const {
          _id,
          userName,
          type,
          avatar,
          phone,
          email,
          name,
          profile,
          country,
          geographic,
          address,
          isExpert,
          password
        } = user
        const data = {
          userId: _id,
          userName,
          type,
          avatar,
          phone,
          email,
          name,
          profile,
          country,
          geographic,
          address,
          isExpert,
          password
        }
        res.send({ code: 0, msg: '获取用户信息成功', data })
      } else {
        res.send({ code: 1, msg: '获取用户信息失败' })
      }
    })
  } else {
    res.send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//修改用户信息，如果没有传id，则默认修改当前登录的用户
router.post('/updateCurrentUserInfo', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const { _id = jwtResult, ...data } = req.body
    UserModel.findByIdAndUpdate({ _id }, data, (error, oldUser) => {
      if (error) {
        res.send({ code: 1, msg: error })
      }
      if (oldUser) {
        res.send({ code: 0, msg: '修改成功' })
      } else {
        res.send({ code: 1, msg: '修改个人信息失败！' })
      }
    })
  } else {
    res.send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取所有专家信息ok
router.get('/getAllExpertInfo', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    UserModel.find({ isExpert: true }, (error, users) => {
      if (error) {
        res.send({ code: 1, msg: error })
      }
      if (users) {
        const data = users.map(item => {
          const {
            _id,
            userName,
            avatar,
            phone,
            email,
            name,
            isExpert,
          } = item
          return {
            _id,
            userName,
            avatar,
            phone,
            email,
            name,
            isExpert,
          }
        })
        res.send({ code: 0, data })
      } else {
        res.send({ code: 1, msg: '获取所有专家信息失败' })
      }
    })
  } else {
    res.send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//上传头像
router.post('/uploadAvatar', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    const form = new formidable.IncomingForm();
    form.uploadDir = '././public/images'
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
      if (err) {
        res.send({ code: 1, msg: '上传头像失败！' })
      } else {
        let img = files.avatar.path
        img = img.replace("public", "")
        img = img.replace("\\", "/")
        img = img.replace("\\", "/")
        UserModel.findByIdAndUpdate({ _id: userId }, { avatar: `${url}${img}` }, (err, user) => {
          if (err) {
            res.send({ code: 1, msg: '上传头像失败！' })
          } else {
            res.send({ code: 0, msg: '上传头像成功！' })
          }
        })
      }
    })
  } else {
    res.send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取用户列表 (支持分页和条件查询)
router.get('/getUserList', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    let {
      userName = "",
      type = "",
      currentPage = 1,
      pageSize = 10,
    } = req.query
    userName = String(userName)
    console.log(userName)
    type = String(type)
    currentPage = Number(currentPage)
    pageSize = Number(pageSize)
    let total = 0//总数
    let totalPage = 0//总页数
    let skipCount = parseInt((currentPage - 1) * pageSize)//分页跳过条数
    const _filter = {
      $and: [  // 多字段同时匹配, $options: '$i' 忽略大小写
        { userName: { $regex: userName, $options: '$i' } },
        { type: { $regex: type, $options: '$i' } },
      ]
    }
    UserModel.countDocuments(_filter, (err, doc) => { // 查询总条数（用于分页）
      if (err) {
        res.send({ code: 1, msg: '获取信息失败', data: err })
      } else {
        total = doc
        totalPage = Math.ceil(doc / pageSize)
      }
    })
    UserModel.find(_filter).limit(pageSize) // 最多显示pageSize条
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

//删除用户
router.post('/removeUser', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
    } = req.body
    UserModel.findByIdAndRemove(_id, (err, user) => {
      if (err) {
        res.send({ code: 1, msg: '删除失败!', data: err })
      }
      if (user) {
        res.send({ code: 0, msg: '删除成功!' })
      } else {
        res.send({ code: 1, msg: '删除失败!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

module.exports = router;
