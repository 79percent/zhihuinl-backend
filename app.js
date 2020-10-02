var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userAPi = require('./routes/user');
var applyJobApi = require('./routes/applyJob');
var articleApi = require('./routes/article');
var recruitApi = require('./routes/recruit');
var sellApi = require('./routes/sell');
var questionApi = require('./routes/question');

var app = express();

var cors = require('cors');
app.use(cors());
// app.use('/static', express.static('upload'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userAPi);//用户
app.use('/applyJob', applyJobApi);//求职
app.use('/recruit', recruitApi);//招聘
app.use('/sell', sellApi);//销售
app.use('/article', articleApi);//文章
app.use('/question', questionApi);//问题

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
