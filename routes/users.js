var Router = require ('koa-router');
var model = require('../models/users');

var router = Router({
    prefix: '/users'
});

var bodyParser = require('koa-bodyparser');

//get user from the id supplied
router.get('/:id)', async (cnx, next) => {
    cnx.body = {message: "getting user by id"}
    let id= cnx.params.id
    let data = await model.getById(id);

    if(data.length === 0){
        cnx.response.status = 404;
        cnx.body = {message: "user not found"}
    }
    else
    cnx.body = data;
    
});

//convert the cnx body data into a simple object which is then passed to the models
//cretaing a new user
router.post('/signup', bodyParser(), async(cnx, next)=> {
    cnx.body = {message: "Signing user up"}
    let newUser = {
        username : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.username,
        email : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.email,
        password : cnx.request.body.values === undefined ? undefined : cnx.request.body.values.password,
        passwordConfirmation : cnx.request.body.values === undefined ? undefined : cnx.request.body.values.passwordConfirmation
    };
    try{
        await model.add(newUser)
        cnx.response.status = 201;
        cnx.body = { message: "user successfully added"}
    }
    catch(error){
        cnx.response.status = error.status;
        cnx.body = {message:error.message};
    };
});

//verifiying a login 
router.post('/login',bodyParser(),  async (cnx, next) =>{
    let userInfo = {
        email : cnx.request.body === undefined ? undefined: cnx.request.body.email,
        password : cnx.request.body === undefined ? undefined : cnx.request.body.password,
    };

    let data = await model.validate(userInfo)

    if (data === null){
        cnx.body.response.status = 404;
    }
    else{
        cnx.body = data;
    }
});

module.exports = router;