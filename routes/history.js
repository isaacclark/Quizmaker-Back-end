var Router = require('koa-router');
var model = require('../models/history');

//prefix for all the fetch requests to use to access these functions
var router = Router({
    prefix: '/history'
});

//find all closed quizzes
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

//find all open quizzes
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

//fetch data from a specified test that has yet to be submitted
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

//fetch a finished test 
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

//get the questions from a specific test
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