var mysql = require('promise-mysql');
var info = require('../config');


exports.getAllClosed = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //Find test data for all tests completed by user
        let sql = `SELECT id, quizID, score FROM test WHERE userID = ${id} AND completed = 1`;
        let data = await connection.query(sql);
        let test = null;
        let stringScore = ""
        let quizzes = []
        for(let i =0; i < data.length; i++){
            //Select info about the quiz the test was taken from
            sql = `SELECT title, description, imageURL from quiz WHERE id = ${data[i].quizID};`
            test = await connection.query(sql)
            //Select id's of all questions from quiz to get number of questions
            sql = `SELECT id from questions WHERE quizID = ${data[i].quizID}`
            questionIDs = await connection.query(sql)
            if(data[i].score === null){
                stringScore = "0"
            }
            else{
                stringScore = data[i].score.toString()
            }
            //object returned gives test id, quiz title, quiz description, quiz image, score as a string out of how many questions
            let tobepushed = {
                id : data[i].id,
                title : test[0].title,
                description : test[0].description,
                imageURL : test[0].imageURL,
                score : stringScore + " / " + (questionIDs.length).toString()
            }
            quizzes.push(tobepushed)        
        }
        await connection.end();
        return quizzes;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
            throw error;
    }
}
exports.getOpenQuiz= async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //Find test data for all tests completed by user
        let sql = `SELECT quizID FROM test WHERE id = ${id} AND completed = 0`;
        let data = await connection.query(sql);
        await connection.end();
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
            throw error;
    }
}

exports.getAllOpen = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //Find test data for all tests completed by user
        let sql = `SELECT id, quizID, time FROM test WHERE userID = ${id} AND completed = 0`;
        let data = await connection.query(sql);
        let test = null;
        let time = ""
        let quizzes = []
        for(let i =0; i < data.length; i++){
            console.log(data[i].time)
            //Select info about the quiz the test was taken from
            sql = `SELECT title, description, imageURL from quiz WHERE id = ${data[i].quizID};`
            test = await connection.query(sql)
            //Select id's of all questions from quiz to get number of questions
            sql = `SELECT id from questions WHERE quizID = ${data[i].quizID}`
            questionIDs = await connection.query(sql)
            //object returned gives test id, quiz title, quiz description, quiz image, score as a string out of how many questions
            let tobepushed = {
                id : data[i].id,
                title : test[0].title,
                description : test[0].description,
                imageURL : test[0].imageURL,
                time : data[i].time
            }
            quizzes.push(tobepushed)        
        }
        await connection.end();
        return quizzes;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
            throw error;
    }
}

exports.getTestByID = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT title, description, imageURL from quiz WHERE quiz.id IN (SELECT quizID FROM test WHERE id = ${id}) `;
        let data = await connection.query(sql);
        sql = `SELECT score FROM test WHERE id = ${id}`;
        let score = await connection.query(sql);
        let test ={
            id : id,
            title : data[0].title,
            description: data[0].description,
            imageURL : data[0].imageURL,
            score : score[0].score
        }
        await connection.end();
        return test;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}


exports.getQuestionsByID = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT id, question, imageURL FROM questions WHERE questions.quizID IN(SELECT quizID FROM test WHERE id = ${id})`;
        let data = await connection.query(sql);
        let userAnswerCall = null
        let quizAnswerCall = null
        let questions = []
        for(let i =0; i < data.length; i++){
            sql = `SELECT answer FROM useranswers WHERE testID = ${id} AND questionID = ${data[i].id}`
            userAnswerCall = await connection.query(sql);
            sql = `SELECT answer FROM answers WHERE questionID = ${data[i].id} AND correct = 1`
            quizAnswerCall = await connection.query(sql);
            if(userAnswerCall.length < 1){
                userAnswerValue = ""
            }
            else{
                userAnswerValue = userAnswerCall[0].answer
            }
            newQuestion ={
                id : data[i].id,
                question : data[i].question,
                imageURL : data[i].imageURL,
                userAnswer : userAnswerValue,
                quizAnswer : quizAnswerCall[0].answer
            }
            questions.push(newQuestion);
        }
        await connection.end();
        return questions;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}