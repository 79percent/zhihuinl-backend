//评论表
const mongoose = require('mongoose')
const commentsSchema = mongoose.Schema({
  questionId: { type: String, required: true },//问题的id
  userId: { type: String, required: true },//发出该评论的用户id
  targetUserId: { type: String, required: false },//指向父评论的用户Id,如果不是对评论的回复,那么该值为null
  parentId: { type: String, required: false },//指向父评论的id,如果不是对评论的回复,那么该值为null
  parentCommentId: { type: String, required: false },//指向一级评论的id,如果不是对二级评论的回复,那么该值与parentId相同
  content: { type: String, required: true },//评论内容
  createTime: { type: Number, required: true },//发布日期
})

module.exports = commentsSchema