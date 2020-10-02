var express = require('express');
var router = express.Router();
var { RecruitModel } = require('../../db/models')
var JwtUtil = require('../../utils/jwt')
var url = require('../../utils/url')

const sexMap = {
  'man': '男',
  'women': '女',
  'all': '不限男女',
}

//发布招工信息的路由
router.post('/addRecruit', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    const {
      city,
      details,
      mobile,
      nums,
      salary,
      sex,
      site,
      title,
    } = req.body
    const createTime = new Date().valueOf()
    new RecruitModel({
      providerId: userId,
      city,
      details,
      mobile,
      nums,
      salary,
      sex: sexMap[sex],
      site,
      title,
      createTime,
    }).save((err, recruit) => {
      if (err) {
        res.send({ code: 1, msg: '发布招聘信息失败!', data: err })
      }
      if (recruit) {
        res.send({ code: 0, msg: '发布招聘信息成功!' })
      } else {
        res.send({ code: 1, msg: '发布招聘信息失败!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取所有招工信息的路由
router.get('/getRecruits', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    RecruitModel.find((error, recruits) => {
      if (error) {
        res.send({ code: 1, msg: '获取信息失败！' })
      }
      if (recruits) {
        res.send({ code: 0, msg: '获取信息成功！', data: recruits })
      } else {
        res.send({ code: 1, msg: '获取信息失败！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//删除招工信息的路由
router.post('/removeRecruit', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
    } = req.body
    RecruitModel.findByIdAndRemove(_id, (err, recruit) => {
      if (err) {
        res.send({ code: 1, msg: '删除失败!', data: err })
      }
      if (recruit) {
        res.send({ code: 0, msg: '删除成功!' })
      } else {
        res.send({ code: 1, msg: '删除失败,未找到该招工信息!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取招工列表 (支持分页和条件查询)
router.get('/getRecruitList', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    let {
      title = "",
      currentPage = 1,
      pageSize = 10,
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
    RecruitModel.countDocuments(_filter, (err, doc) => { // 查询总条数（用于分页）
      if (err) {
        res.send({ code: 1, msg: '获取信息失败', data: err })
      } else {
        total = doc
        totalPage = Math.ceil(doc / pageSize)
      }
    })
    RecruitModel.find(_filter).limit(pageSize) // 最多显示pageSize条
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

//修改招工信息的路由
router.post('/updateRecruit', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
      ...params
    } = req.body
    RecruitModel.findByIdAndUpdate({ _id }, params, (err, oldRecruit) => {
      if (err) {
        res.send({ code: 1, msg: '修改失败！', data: err })
      }
      if (oldRecruit) {
        res.send({ code: 0, msg: '修改成功！' })
      } else {
        res.send({ code: 1, msg: '修改失败！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取招工信息详情的路由
router.get('/getRecruitDetail', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const { _id } = req.query
    RecruitModel.findOne({ _id }, (err, recruits) => {
      if (err) {
        res.send({ code: 1, data: err, msg: '获取招工信息详情失败！' })
      }
      if (recruits) {
        res.send({ code: 0, msg: '获取招工信息详情成功', data: recruits })
      } else {
        res.send({ code: 1, data: err, msg: '获取招工信息详情失败！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

module.exports = router;
