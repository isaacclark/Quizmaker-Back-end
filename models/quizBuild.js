var mysql = require('promise-mysql');
var info = require('../config');

exports.addQuiz = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `INSERT INTO quiz (title, description, imageURL, author)
            VALUES ('${article.title}' , '${article.description}' , '${article.imageURL}' , '${article.author}')
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

