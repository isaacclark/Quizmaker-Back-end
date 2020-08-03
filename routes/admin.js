var Router = require('koa-router');
var model = require('../models/admin');

var router = Router({
    prefix: '/admin'
});
//https://github.coventry.ac.uk/ab8505/OktobAPI/tree/routing
//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');

router.post('/create_db', async (ctx, next) => {
    let item = await model.createTables(ctx.params.id);
    ctx.body = item;
});

module.exports = router; 