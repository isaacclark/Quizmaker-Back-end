var mysql = require('promise-mysql');
var info = require('../config');

//add a new quiz 
exports.addQuiz = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //insert the data posted
        let sql = `INSERT INTO quiz (title, description, imageURL, author, time)
            VALUES ('${article.title}' , '${article.description}' , '${article.imageURL}' , '${article.author}', '${article.time}')
        `;
        await connection.query(sql);
        sql = `SELECT LAST_INSERT_ID()`
        let data = await connection.query(sql);
        await connection.end();
        //return the id of the newly created quiz
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

//add questions to the newly created quiz
exports.addQuestion = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `INSERT INTO questions (question, imageURL, quizID)
            VALUES ('${article.question}' , '${article.imageURL}' , '${article.quizID}')
        `;
        await connection.query(sql);
        sql = `SELECT LAST_INSERT_ID()`
        let data = await connection.query(sql);
        await connection.end();
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

//add user answers
exports.addAnswer = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `INSERT INTO answers (answer, correct, questionID)
            VALUES ('${article.answer}' , '${article.correct}' , '${article.questionID}')
        `;
        let data = await connection.query(sql);
        await connection.end();
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
};  

