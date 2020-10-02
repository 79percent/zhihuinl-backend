//滞销产品表
const mongoose = require('mongoose')
const sellSchema = mongoose.Schema({
  providerId: { type: String, required: true },//发布人id，既当前登录用户的id
  createTime: { type: String, required: true },//发布日期
  title: { type: String, required: true },//产品标题
  imgs: { type: Array, required: true },//产品图片，保存其图片在服务器的路径
  inventory: { type: Number, default: null },//库存数量
  price: { type: Number, required: true },//产品价格
  address: { type: String, required: true },//地址
  mobile: { type: String, required: true },//联系方式
  introduce: { type: String, required: true },//产品介绍
  description: { type: String, required: true },//产品简介10字以内
})

module.exports = sellSchema