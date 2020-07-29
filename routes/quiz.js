var Router = require('koa-router');
var model = require('../models/quiz');
var bodyParser = require('koa-bodyparser');

var router = Router({
    prefix: '/api/v1.0/quiz'
});

//browse all quizzes
router.get('/', async (cnx, next) => {
    let id =cnx.params.id;
    data = await model.getAll(id);;
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

//attempt a specific quiz
router.get('/:id', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getById(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

//get the questions of a specific quiz
router.get('/:id/questions', async (cnx, next) => {
    let id = cnx.params.id;
    data = await model.getQuestions(id);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

//get the answers of a specific question
router.get('/:id/questions/:questionID', async (cnx, next) => {
    let questionID = cnx.params.questionID;
    data = await model.getAnswers(questionID);
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "article no foundy"}
    }
    else
        cnx.body = data;
});

router.post('/', bodyParser(), async (cnx, next) =>{
    let test = {
        userID : cnx.request.body.newTest === undefined ? undefined: cnx.request.body.newTest.userID,
        quizID : cnx.request.body.newTest === undefined ? undefined: cnx.request.body.newTest.quizID,
        completed :  cnx.request.body.newTest === undefined ? undefined: cnx.request.body.newTest.completed,
    }

    data = await model.addTest(test)
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = data;
    }
})

//upload question details
router.post('/answers', bodyParser(), async (cnx, next) =>{
    console.log(cnx.request.body.userAnswersArray)
    for (let i =0; i < cnx.request.body.userAnswersArray.length; i++){
        //console.log(cnx.request.body.userAnswersArray)
        let answer = {
            answer : cnx.request.body.userAnswersArray[i] === undefined ? undefined: cnx.request.body.userAnswersArray[i].answer,
            testID :  cnx.request.body.userAnswersArray[i] === undefined ? undefined: cnx.request.body.userAnswersArray[i].testID,
            questionID : cnx.request.body.userAnswersArray[i] === undefined ? undefined: cnx.request.body.userAnswersArray[i].questionID
        }
        data = await model.addUserAnswer(answer)
    }
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = {message : "successfully uploaded quiz/questions/answers"}
    }
})


//upload quiz details
router.get('/score/:id', bodyParser(), async (cnx, next) =>{
    let id = cnx.params.id;
    data = await model.grade(id)
    
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = data;
    }
})

router.get('/savetest/:id/:userid', bodyParser(), async (cnx, next) =>{
    let quizID= cnx.params.id;
    let userID = cnx.params.userid;
    data = await model.getUserAnswers(quizID, userID)
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = data;
    }
})
/*
router.put('/:id', bodyParser(), async (cnx, next) => {
    let newArticle = {title:cnx.request.body.title, fullText:cnx.request.body.fullText}
    let id =cnx.params.id;
    await model.update(newArticle);
    cnx.body = {message:"updated successfully"};
});;
*/

module.exports = router; 