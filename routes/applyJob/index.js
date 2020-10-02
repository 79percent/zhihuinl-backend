var express = require('express');
var router = express.Router();
var { ApplyjobModel } = require('../../db/models')
var JwtUtil = require('../../utils/jwt')
var url = require('../../utils/url')

const sexMap = {
  'man': '男',
  'women': '女',
}

//发布求职信息
router.post('/addApplyjob', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const userId = jwtResult
    const createTime = new Date().valueOf()
    const {
      age,
      city,
      educationBackground,
      mobile,
      name,
      salary1,
      salary2,
      sex,
      speciality,
      title,
      workExperience,
    } = req.body
    new ApplyjobModel({
      providerId: userId,
      age,
      city,
      educationBackground,
      mobile,
      name,
      salary: `${salary1} - ${salary2}`,
      sex: sexMap[sex],
      speciality,
      title,
      workExperience,
      createTime,
    }).save((err, applyjob) => {
      if (err) {
        res.send({ code: 1, msg: '发布失败!', data: err })
      }
      if (applyjob) {
        res.send({ code: 0, msg: '发布成功!' })
      } else {
        res.send({ code: 0, msg: '发布失败!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取所有求职信息
router.get('/getApplyjobs', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    ApplyjobModel.find((error, applyjobs) => {
      if (error) {
        res.send({ code: 1, msg: '获取信息失败！' })
      }
      if (applyjobs) {
        res.send({ code: 0, msg: '获取信息成功！', data: applyjobs })
      } else {
        res.send({ code: 1, msg: '获取信息失败！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取求职列表 (支持分页和条件查询)
router.get('/getApplyjobList', (req, res) => {
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
    ApplyjobModel.countDocuments(_filter, (err, doc) => { // 查询总条数（用于分页）
      if (err) {
        res.send({ code: 1, msg: '获取信息失败', data: err })
      } else {
        total = doc
        totalPage = Math.ceil(doc / pageSize)
      }
    })
    ApplyjobModel.find(_filter).limit(pageSize) // 最多显示pageSize条
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

//删除求职信息的路由
router.post('/removeApplyjob', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
    } = req.body
    ApplyjobModel.findByIdAndRemove(_id, (err, applyjob) => {
      if (err) {
        res.send({ code: 1, msg: '删除失败!', data: err })
      }
      if (applyjob) {
        res.send({ code: 0, msg: '删除成功!' })
      } else {
        res.send({ code: 1, msg: '删除失败,未找到该求职信息!' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//修改求职信息的路由
router.post('/updateApplyjob', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const {
      _id,
      ...params
    } = req.body
    ApplyjobModel.findByIdAndUpdate({ _id }, params, (err, oldApplyjob) => {
      if (err) {
        res.send({ code: 1, msg: '修改失败！', data: err })
      }
      if (oldApplyjob) {
        res.send({ code: 0, msg: '修改成功！' })
      } else {
        res.send({ code: 1, msg: '修改失败，未找到该求职信息！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

//获取招工信息详情的路由
router.get('/getApplyjobDetail', (req, res) => {
  //验证token是否失效
  const { token } = req.headers
  const jwt = new JwtUtil(token)
  const jwtResult = jwt.verifyToken()
  if (jwtResult) {
    const { _id } = req.query
    ApplyjobModel.findOne({ _id }, (err, applyjob) => {
      if (err) {
        res.send({ code: 1, msg: '获取详情失败！', data: err })
      }
      if (applyjob) {
        res.send({ code: 0, msg: '获取详情成功!', data: applyjob })
      } else {
        res.send({ code: 1, msg: '获取详情失败,未找到该求职信息！' })
      }
    })
  } else {
    res.status(401).send({ code: 1, msg: '当前用户登录信息已失效，请重新登录！' })
  }
})

module.exports = router;
