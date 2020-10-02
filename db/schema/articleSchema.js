//农业文章表
const mongoose = require('mongoose')
const articleSchema = mongoose.Schema({
  providerId: { type: String, required: true },//发布人id，既当前登录用户的id
  title: { type: String, required: true },//文章标题
  content: { type: String, required: true },//文章内容
  img: { type: String, default: null },//文章图片
  createTime: { type: Number, required: true },//文章发布日期
  href: { type: String, required: true },//文章链接
  tags: { type: String, required: true },//文章标签or关键字
})

module.exports = articleSchema