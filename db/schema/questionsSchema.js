//问题表
const mongoose = require('mongoose')
const questionsSchema = mongoose.Schema({
  userId: { type: String, required: true },//发布人id，既当前登录用户的id
  title: { type: String, required: true },//问题标题
  description: { type: String, required: false },//问题描述
  imgs: { type: Array, required: false },//图片，保存其图片在服务器的路径
  createTime: { type: Number, required: true },//发布日期
})

module.exports = questionsSchema