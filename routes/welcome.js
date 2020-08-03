var    Router = require('koa-router');
var    router = Router({
    prefix: '/'
});

//small path to ensure backend is running will display welcome if the 
//backend url is loaded up
router.get('/', (cnx, next) => {
    cnx.body = {message:'Welcome screen'};
});

module.exports = router;