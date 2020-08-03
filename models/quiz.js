var mysql = require('promise-mysql');
var info = require('../config');

//get all quizzes created
exports.getAll = async (page, limit, order)=> {
    try {
        //connect to db using the settings stored in ../config
        const connection = await mysql.createConnection(info.config);
        //only select data needed to be displayed for browse and id to link to full quiz
        let sql = `SELECT id, title, description, imageURL, author FROM quiz`;
        let data = await connection.query(sql);
        for(let i =0; i < data.length; i++){
            sql = `Select username FROM users WHERE id = ${data[i].author}`
            let author = await connection.query(sql);
            //set the author id in the original request to the author name
            data[i].author = author[0].username
        }
        await connection.end();
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

//essentially same function as above except it will search for all quizzes that don't have a recordedattempt by the user
exports.getAllByID = async (id)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        //select all quizzes that dont have the same quiz id as any test id from tests attempted by the user
        let sql = `SELECT id, title, description, imageURL, author FROM quiz WHERE quiz.id 
        NOT IN( SELECT quizID FROM test WHERE userID = ${id})`;
        let data = await connection.query(sql);
        for(let i =0; i < data.length; i++){
            sql = `Select username FROM users WHERE id = ${data[i].author}`
            let author = await connection.query(sql);
            data[i].author = author[0].username
        }
        await connection.end();
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

//gets all data from a specific quiz, in order for an attempt to begin by the user
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

//gets all questions that have the same quizID as the id supplied from the quiz fetched in the function above
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

//another tier of the same above, this time fetching all answers for each question
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

//upon submitting a quiz attempt a quest is created
exports.addTest = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        let data = null;
        //check to see if a test by the same user for the same quiz has already been stored
        let sql = `SELECT id FROM test WHERE userID = ${article.userID} AND quizID = ${article.quizID};`
        let idExists = await connection.query(sql);
        // if user has already attempted this quiz before update the current row rather than create a new test
        if(idExists.length > 0){
            sql = `UPDATE test SET completed = ${article.completed}, time = '${article.time}'
            WHERE id = ${idExists[0].id}`
            await connection.query(sql);
            data = idExists[0].id
        }
        else{
        //if test doesn't previously exist create a new one
            sql = `INSERT INTO test (userID, quizID, completed, time)
            VALUES ('${article.userID}' , '${article.quizID}' , '${article.completed}','${article.time}')
            `;
            await connection.query(sql);
        //return the id of the newly created quiz
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

//store the answer submitted by a user for a specific question
exports.addUserAnswer = async (article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //find if an answer for the question has previously been saved by the user
        let sql = `SELECT id FROM useranswers WHERE testID = ${article.testID} AND questionID = ${article.questionID};`
        let idExists = await connection.query(sql);
        //if so update the old answer
        if(idExists.length > 0){
            sql = `Update useranswers SET answer = ${article.answer}
            WHERE id = ${idExists[0].id}`
            await connection.query(sql);
            data = idExists[0].id
        }
        else{
        // if not create a new useranswer
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

//get the answers the user has previously submitted
exports.getUserAnswers = async (quizID, userID) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //select all from useranswers where the question id is the same as the id in questions where the quiz id is equal to the quizID parameter 
        //and the useranswer testID is equal to the id from test where the userID is the same as the id parameter (the current user's id)
        let sql = `SELECT * from useranswers WHERE (questionID IN
        (SELECT id FROM questions WHERE quizID = ${quizID})) AND 
        testID IN (SELECT id FROM test WHERE userID = ${userID});
        `;
        let data = await connection.query(sql);
        await connection.end();
  
        if (data === []){
            data = null;
        }
        //return useranswer info
        return data;
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

//get the time spent remaining on a specific test
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

//compare the user's answers to the correct answers and count hwo many are correct
exports.grade = async (testID) => {
    try {
        const connection = await mysql.createConnection(info.config);
        //get all the user's answers from a specific test
        let sql = `SELECT answer, questionID FROM useranswers WHERE( testID = ${testID})
        `;
        let userAnswers = await connection.query(sql);
        //select the correct answers from answers where the questionID is the same as the id in questions where the quizID is the same id in quiz where the id is the same as the quizID in test
        //where the id is equal to the parameter testID
        sql = `SELECT answer, questionID FROM answers WHERE correct = 1 AND answers.questionID IN 
            (SELECT id FROM questions WHERE questions.quizID IN 
            (SELECT quizID FROM test WHERE id =  ${testID}))  ;
        `;
        let quizAnswers = await connection.query(sql);
        //compare the user's answers to the correct answer, if correct +1 to the var counter        
        let counter = 0;
        for (let i = 0; i < userAnswers.length; i++){
            for(let j =0; i < quizAnswers.length; j++){
                if(userAnswers[i].questionID === quizAnswers[j].questionID){
                    if(userAnswers[i].answer === quizAnswers[j].answer) counter++;
                }
            }
        }
        //update the score in test
        sql = `UPDATE test 
        SET score = ${counter} 
        WHERE id = ${testID};
        `;
        await connection.query(sql);
        await connection.end();
        //return the score
        return counter;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  
