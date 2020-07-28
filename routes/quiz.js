var Router = require('koa-router');
var model = require('../models/quiz');

var router = Router({
    prefix: '/api/v1.0/quiz'
});

var bodyParser = require('koa-bodyparser');
//browse all quizzes
router.get('/', async (cnx, next) => {
    let id =cnx.params.id;
    cnx.body = await model.getAll(id);
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
router.get('/:id/questions/', async (cnx, next) => {
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
//upload quiz details
router.post('/quizBuild', bodyParser(), async (cnx, next) =>{
    let quiz = {
        title : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.title,
        description : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.description,
        imageURL :  cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.imageURL,
        author : cnx.request.body.newQuiz === undefined ? undefined: cnx.request.body.newQuiz.author
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
router.post('/quizBuild/question', bodyParser(), async (cnx, next) =>{

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
router.post('/quizBuild/answers', bodyParser(), async (cnx, next) =>{
   
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
//get last entered id for tests
router.get('/newtestid', bodyParser(), async (cnx, next) =>{
    data = await model.newtestid()
    if (data === null){
        cnx.body.response.status = 404;
        cnx.body = {message: "Error in attempting quiz"}
    }
    else{
        cnx.body = data;
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

//upload question details
router.post('/answers', bodyParser(), async (cnx, next) =>{
    for (let i =0; i < cnx.request.body.userAnswersArray.length; i++){
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

router.put('/:id', bodyParser(), async (cnx, next) => {
    let newArticle = {title:cnx.request.body.title, fullText:cnx.request.body.fullText}
    let id =cnx.params.id;
    await model.update(newArticle);
    cnx.body = {message:"updated successfully"};
});;


module.exports = router; 