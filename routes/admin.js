var Router = require('koa-router');
var model = require('../models/admin');

var router = Router({
    prefix: '/admin'
});
//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');

router.post('/create_db', async (ctx, next) => {
    let item = await model.createTables(ctx.params.id);
    ctx.body = item;
});

router.post('/populate_db', async (ctx, next) => {
    let item = await model.populateTables(ctx.params.id);
    ctx.body = item;
});;

module.exports = router; 