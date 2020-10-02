/*
包含n个操作数据库集合数据的Model模块
*/
var mongoose = require('mongoose')

var userSchema = require('./schema/userSchema')
var articleSchema = require('./schema/articleSchema')
var recruitSchema = require('./schema/recruitSchema')
var applyjobSchema = require('./schema/applyjobSchema')
var sellSchema = require('./schema/sellSchema')
var questionsSchema = require('./schema/questionsSchema')
var commentsSchema = require('./schema/commentsSchema')

// 1.连接数据库
mongoose.connect('mongodb://localhost:27017/zhihuinl')
const conn = mongoose.connection
conn.on('connected',()=>{
  console.log('连接数据库成功');
})

//用户
const UserModel = mongoose.model('users', userSchema)
exports.UserModel = UserModel

//文章
const ArticleModel = mongoose.model('articles', articleSchema)
exports.ArticleModel = ArticleModel

//招工
const RecruitModel = mongoose.model('recruits', recruitSchema)
exports.RecruitModel = RecruitModel

//求职
const ApplyjobModel = mongoose.model('applyjobs', applyjobSchema)
exports.ApplyjobModel = ApplyjobModel

//销售
const SellModel = mongoose.model('sells', sellSchema)
exports.SellModel = SellModel

//问题表
const QuestionsModel = mongoose.model('questions', questionsSchema)
exports.QuestionsModel = QuestionsModel

//评论表
const CommentsModel = mongoose.model('comments', commentsSchema)
exports.CommentsModel = CommentsModel