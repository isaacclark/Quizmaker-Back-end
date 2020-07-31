//import koa
var Koa = require('koa');

var special = require('./routes/welcome');
var articles = require('./routes/articles'); 
var admin = require ('./routes/admin');
var users = require ('./routes/users');
var quiz = require('./routes/quiz');
var quizBuild = require('./routes/quizBuild');
var history = require('./routes/history');

//create a koa instance and store it in app variable
var app = new Koa();
const cors = require('@koa/cors');

app.use(cors());
app.use(special.routes());
app.use(articles.routes()); 
app.use(admin.routes());
app.use(users.routes());
app.use(quiz.routes());
app.use(history.routes());
app.use(quizBuild.routes());


var port = process.env.PORT || 3000; 
console.log('listening...')
app.listen(port); 