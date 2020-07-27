var Router = require('koa-router');
var model = require('../models/quiz');

var router = Router({
    prefix: '/api/v1.0/quiz'
});

router.get('/:id([0-9]{1,})', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getById(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

router.post('/:id([0-9]{1,})', async (cnx, next) =>{
    let id = cnx.params.id
    let amswer = {
        answer : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.answer,
    }
    data = await model.Attempt(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
})

router.put('/:id', bodyParser(), async (cnx, next) => {
    let newArticle = {title:cnx.request.body.title, fullText:cnx.request.body.fullText}
    let id =cnx.params.id;
    await model.update(newArticle);
    cnx.body = {message:"updated successfully"};
});


