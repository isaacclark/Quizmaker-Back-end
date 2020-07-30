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

exports.getAllByID = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT id, title, description, imageURL FROM quiz WHERE quiz.id 
        NOT IN( SELECT quizID FROM test WHERE userID = ${id})`;
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

exports.addTest = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        let data = null;
        let sql = `SELECT id FROM test WHERE userID = ${article.userID} AND quizID = ${article.quizID};`
        let idExists = await connection.query(sql);
        console.log(idExists)
        if(idExists.length > 0){
            sql = `UPDATE test SET completed = ${article.completed}, time = '${article.time}'
            WHERE id = ${idExists[0].id}`
            await connection.query(sql);
            data = idExists[0].id
        }
        else{
            sql = `INSERT INTO test (userID, quizID, completed, time)
            VALUES ('${article.userID}' , '${article.quizID}' , '${article.completed}','${article.time}')
            `;
            await connection.query(sql);
            sql = `SELECT LAST_INSERT_ID()`
            data = await connection.query(sql);
        }
        await connection.end();
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

exports.addUserAnswer = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT id FROM useranswers WHERE testID = ${article.testID} AND questionID = ${article.questionID};`
        let idExists = await connection.query(sql);
        if(idExists.length > 0){
            sql = `Update useranswers SET answer = ${article.answer}
            WHERE id = ${idExists[0].id}`
            await connection.query(sql);
            data = idExists[0].id
        }
        else{
            sql = `INSERT INTO useranswers (answer, testID, questionID)
            VALUES ('${article.answer}' , '${article.testID}' , '${article.questionID}')
        `;
            await connection.query(sql);
        }
        await connection.end();

        let data = {message : "set useranswer!"}
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

exports.getUserAnswers = async (quizID, userID) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT * from useranswers WHERE (questionID IN
        (SELECT id FROM questions WHERE quizID = ${quizID})) AND 
        testID IN (SELECT id FROM test WHERE userID = ${userID});
        `;
        let data = await connection.query(sql);
        await connection.end();
  
        if (data === []){
            data = null;
        }
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

exports.getTestTime = async (quizID, userID) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT time FROM test WHERE quizID = ${quizID} AND userID = ${userID};
        `;
        let data = await connection.query(sql);
        await connection.end();
  
        if (data === []){
            data = null;
        }
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

exports.grade = async (testID) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT answer FROM useranswers WHERE( testID = ${testID})
        `;
        let userAnswers = await connection.query(sql);
        sql = `SELECT answer FROM answers WHERE correct = 1 AND answers.questionID IN 
            (SELECT id FROM questions WHERE questions.quizID IN 
            (SELECT quizID FROM test WHERE id =  ${testID}))  ;
        `;
        let quizAnswers = await connection.query(sql);
     
        let counter = 0;
        for (let i = 0; i < userAnswers.length; i++){
            if(userAnswers[i].answer == quizAnswers[i].answer) counter++;
        }
        sql = `UPDATE test 
        SET score = ${counter} 
        WHERE id = ${testID};
        `;
        let data = await connection.query(sql);
        await connection.end();
        return counter;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  
/*
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
};*/