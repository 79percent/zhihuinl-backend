const mongoose = require('mongoose')
const avatarUrl = require('../../utils/defaultAvatarUrl')
//2.1用户表users
const userSchema = mongoose.Schema({
  userName: { type: String, required: true },//账号admin
  password: { type: String, required: true },//密码admin
  type: { type: String, required: true },//权限管理：user为用户；admin为管理员
  avatar: { type: String, default: avatarUrl },//头像:数据库保存图片在服务器上的路径
  phone: { type: String, default: null },//手机17758163616
  email: { type: String, default: null },//邮箱antdesign@alipay.com
  name: { type: String, default: null },//昵称Serati Ma 
  profile: { type: String, default: null },//个人简介
  country: { type: String, default: null },//国家/地区 中国
  geographic: { type: Object, default: null },//所在省市 浙江省 杭州市
  address: { type: String, default: null },//街道地址 西湖区工专路 77 号
  unreadCount: { type: Number, default: 0 },//未读消息的数量
  notices: { type: Array, default: [] },//消息
  isExpert: {type: Boolean, default: false}//是否为专家
  // token: { type: String, default: null },//用户的token
})

module.exports = userSchema