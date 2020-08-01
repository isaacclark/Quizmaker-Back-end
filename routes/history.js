var Router = require('koa-router');
var model = require('../models/history');

var router = Router({
    prefix: '/history'
});

router.get('/closed/:id', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getAllClosed(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

router.get('/open/:id', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getAllOpen(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

router.get('/openquiz/:id', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getOpenQuiz(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

router.get('/test/:id', async (cnx, next)  => {
    let id = cnx.params.id;
    data = await model.getTestByID(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

router.get('/:id/questions', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getQuestionsByID(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

module.exports = router; 