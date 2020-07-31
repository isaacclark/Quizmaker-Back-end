var Router = require('koa-router');
var model = require('../models/quizBuild');
var bodyParser = require('koa-bodyparser');

var router = Router({
    prefix: '/quizBuild'
});


//upload quiz details
router.post('/', bodyParser(), async (cnx, next) =>{
    let quiz = {
        title : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.title,
        description : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.description,
        imageURL :  cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.imageURL,
        author : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.author,
        time : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.time
    }

    data = await model.addQuiz(quiz)
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = data;
    }
})

//upload question details
router.post('/question', bodyParser(), async (cnx, next) =>{

    let question = {
        question : cnx.request.body.newQuestion === undefined ? undefined: cnx.request.body.newQuestion.question,
        imageURL :  cnx.request.body.newQuestion === undefined ? undefined: cnx.request.body.newQuestion.imageURL,
        quizID : cnx.request.body.newQuestion === undefined ? undefined: cnx.request.body.newQuestion.quizID
    }

    data = await model.addQuestion(question)
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = data;
    }
})

//upload answers
router.post('/answers', bodyParser(), async (cnx, next) =>{
   
    for (let i =0; i < cnx.request.body.newAnswers.length; i++){
        let answer = {
            answer : cnx.request.body.newAnswers[i] === undefined ? undefined: cnx.request.body.newAnswers[i].answer,
            correct :  cnx.request.body.newAnswers[i] === undefined ? undefined: cnx.request.body.newAnswers[i].correct,
            questionID : cnx.request.body.newAnswers[i] === undefined ? undefined: cnx.request.body.newAnswers[i].questionID
        }

        data = await model.addAnswer(answer)
    
        if (data === null){
            cnx.body.response.status = 404;
            cnx.body = {message: "Error in attempting quiz"}
        }
        else{
            cnx.body = {message : "successfully uploaded quiz/questions/answers"}
        }
    }
})


module.exports = router; 