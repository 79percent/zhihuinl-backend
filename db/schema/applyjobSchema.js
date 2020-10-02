//求职信息表
const mongoose = require('mongoose')
const applyjobSchema = mongoose.Schema({
  providerId: { type: String, required: true },//发布人id，既当前登录用户的id
  age: { type: String, required: true },//年龄
  city: { type: String, required: true },//所在城市
  educationBackground: { type: String, required: true },//学历
  mobile: { type: String, required: true },//联系电话
  name: { type: String, required: true },//称呼
  sex: { type: String, required: true },//性别
  speciality: { type: String, default: '' },//特长/工作经历
  title: { type: String, required: true },//求职意向
  salary: { type: String, required: true },//期望薪资/月
  workExperience: {type: Number, required: true},//工作经验/年
  createTime: { type: Number, required: true },//发布日期
})

module.exports = applyjobSchema