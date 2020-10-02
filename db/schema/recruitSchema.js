//招工信息表
const mongoose = require('mongoose')
const recruitSchema = mongoose.Schema({
  providerId: { type: String, required: true },//发布人id，既当前登录用户的id
  title: { type: String, required: true },//工作标题
  details: { type: String, default: null },//工作内容详情
  site: { type: String, required: true },//公司
  sex: { type: String, required: true },//性别
  city: { type: String, required: true },//工作地点
  salary: { type: Number, required: true },//薪酬
  mobile: { type: String, required: true },//联系电话
  nums: { type: Number, required: true },//招工人数
  createTime: { type: Number, required: true },//发布日期
})

module.exports = recruitSchema
