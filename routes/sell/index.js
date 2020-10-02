var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var { SellModel } = require('../../db/models')
var JwtUtil = require('../../utils/jwt')
var url = require('../../utils/url')

//获取产品列表 (分页&条件查询)
router.get('/getProductList', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    let {
      title = "",
      currentPage = 1,
      pageSize = 8,
    } = req.query
    title = String(title)
    currentPage = Number(currentPage)
    pageSize = Number(pageSize)
    let total = 0//总数
    let totalPage = 0//总页数
    let skipCount = parseInt((currentPage - 1) * pageSize)//分页跳过条数
    const _filter = {
      $and: [  // 多字段同时匹配, $options: '$i' 忽略大小写
        { title: { $regex: title, $options: '$i' } },
      ]
    }
    SellModel.countDocuments(_filter, (err, doc) => { // 查询总条数（用于分页）
      if (err) {
        res.send({ code: 1, msg: '获取失败', data: err })
      } else {
        total = doc
        totalPage = Math.ceil(doc / pageSize)
      }
    })
    SellModel.find(_filter).limit(pageSize) // 最多显示pageSize条
      .sort({ 'createTime': -1 }) // 倒序
      .skip(skipCount)//分页跳过条数
      .exec((err, doc) => { // 回调
        if (err) {
          res.send({ code: 1, msg: '获取失败', data: err })
        }
        if (doc) {
          const data = {
            list: doc,
            total,
            totalPage,
            currentPage,
            pageSize,
          }
          res.send({ code: 0, data, msg: '获取成功' })
        } else {
          res.send({ code: 1, msg: '获取失败' })
        }
      })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//发布产品
router.post('/addProduct', (req, res) => {
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
          address,
          price,
          introduce,
          inventory,
          mobile,
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
        new SellModel({
          providerId: userId,
          createTime: new Date().valueOf(),
          title,
          address,
          price,
          introduce,
          inventory,
          mobile,
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

//删除产品
router.post('/removeProduct', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
    } = req.body
    SellModel.findByIdAndRemove(_id, (err, doc) => {
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

//修改产品
router.post('/updateProduct', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
      ...params
    } = req.body
    SellModel.findByIdAndUpdate({ _id }, params, (err, old) => {
      if (err) {
        res.send({ code: 1, msg: '修改失败！', data: err })
      }
      if (old) {
        res.send({ code: 0, msg: '修改成功！' })
      } else {
        res.send({ code: 1, msg: '修改失败！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取详情
router.get('/getProductDetail', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const { _id } = req.query
    SellModel.findOne({ _id }, (err, doc) => {
      if (err) {
        res.send({ code: 1, msg: '获取详情失败！', data: err })
      }
      if (doc) {
        res.send({ code: 0, msg: '获取详情成功!', data: doc })
      } else {
        res.send({ code: 1, msg: '获取详情失败！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

module.exports = router;
