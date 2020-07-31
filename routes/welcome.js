var    Router = require('koa-router');
var    router = Router({
    prefix: '/'
});

router.get('/', (cnx, next) => {
    cnx.body = {message:'Welcome screen'};
});

module.exports = router;