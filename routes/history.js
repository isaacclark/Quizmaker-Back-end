var Router = require('koa-router');
var model = require('../models/history');

var router = Router({
    prefix: '/api/v1.0/history'
});

router.get('/:id', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getAll(id);
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