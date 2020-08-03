'use strict';
//import koa
var Koa = require('koa');
const cors = require('@koa/cors');

var welcome = require ('./routes/welcome');
var admin = require ('./routes/admin');
var users = require ('./routes/users');
var quiz = require('./routes/quiz');
var quizBuild = require('./routes/quizBuild');
var history = require('./routes/history');

//create a koa instance and store it in app variable
var app = new Koa();

app.use(cors());
app.use(welcome.routes());
app.use(admin.routes());
app.use(users.routes());
app.use(quiz.routes());
app.use(history.routes());
app.use(quizBuild.routes());

var port = process.env.PORT || 3000; 

app.listen(port); 