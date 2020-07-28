var mysql = require('promise-mysql');
var info = require('../config');

exports.getAll = async (page, limit, order)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT id, title, description, imageURL FROM quiz`;
        let data = await connection.query(sql);
        await connection.end();
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.getById = async (id) => {
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);
        //this is the sql statecment to execute
        let sql = `SELECT * FROM quiz
                    WHERE ID = ${id}
                `;

        //wait for the async code to finish
        let data = await connection.query(sql);
        //wait until connection to db is closed
        await connection.end();
        //return the result
        return data;
    } catch (error) {
        //if an error occured please log it and throw an exception
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.getQuestions = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT * FROM questions WHERE quizID = ${id}`;
        let data = await connection.query(sql);
        await connection.end();
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.getAnswers = async (questionID)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT * FROM answers WHERE questionID = ${questionID}`;
        let data = await connection.query(sql);
        await connection.end();
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}
exports.addQuiz = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        //console.log(article)
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
        //console.log(article)
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
        //console.log(article)
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
}  

exports.addImage = function (conData, req, res, callback) {
    if (userID[1].user == null){
        console.log("you're not logged in")
    }
    else{
        db.connect(conData, function(err, con){
            if (err) {
                callback(err);
                return;
            }	
            upload(req, res, function(err) {
                if (err) {
                    console.log("error :" + err)
                    callback(err);
                    return;;
                }
                console.log("File uploaded sucessfully!.");

                const uploadToDB = `INSERT INTO posts(img_address, userID, title, content, verification) VALUES
                ("${req.files[0].filename}","${userID[1].user}","${req.body.postTitle}","${req.body.postText}", 1);`;
                

                con.query(uploadToDB, (err, row) => {
                    if (err) throw err;
                    
                });

                res.redirect('/')
            });  
        });
    }
};