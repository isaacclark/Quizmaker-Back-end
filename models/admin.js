var mysql = require('promise-mysql');
var info = require('../config');

//used to create the tables originally when building
exports.createTables = async (id) => {
    try{
        const connection = await mysql.createConnection(info.config);

        let sql = `CREATE TABLE IF NOT EXISTS users (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(32),
            username VARCHAR(16),
            pwd VARCHAR(256),
            pwdSalt VARCHAR(32),
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (ID)
        )`;
        
        await connection.query(sql);

        sql = `CREATE TABLE IF NOT EXISTS quiz (
            ID INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(32),
            description VARCHAR(512),
            imageURL VARCHAR(2048),
            author VARCHAR(32),
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            time TIME, 
            PRIMARY KEY (ID)
        )`;

        await connection.query(sql);

        sql = `CREATE TABLE IF NOT EXISTS questions (
            id INT NOT NULL AUTO_INCREMENT,
            question VARCHAR(256),
            imageURL VARCHAR(2048),
            quizID INT, 
            PRIMARY KEY (id),
            FOREIGN KEY (quizID) REFERENCES quiz(id)
        )`;
        
        await connection.query(sql);

        sql = `CREATE TABLE IF NOT EXISTS answers (
            id INT NOT NULL AUTO_INCREMENT,
            answer VARCHAR(16),
            correct BOOLEAN,
            questionID INT, 
            PRIMARY KEY (id),
            FOREIGN KEY (questionID) REFERENCES questions(id)
        )`;

        await connection.query(sql);

        sql = `CREATE TABLE IF NOT EXISTS test (
            id INT NOT NULL AUTO_INCREMENT,
            userID INT,
            quizID INT,
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed BOOLEAN,
            time TIME, 
            Score INT,
            PRIMARY KEY (id),
            FOREIGN KEY (userID) REFERENCES users(id),
            FOREIGN KEY (quizID) REFERENCES quiz(id)
        )`;
        
        await connection.query(sql);

        sql = `CREATE TABLE IF NOT EXISTS userAnswers(
            id INT NOT NULL AUTO_INCREMENT,
            answer VARCHAR(16),
            testID INT, 
            questionID INT,
            PRIMARY KEY (id),
            FOREIGN KEY (testID) REFERENCES test(id),
            FOREIGN KEY (questionID) REFERENCES questions(id)
        )`;

        await connection.query(sql);

        await connection.end();

        return {message:"created successfully"};
        
    } catch (error) {
        console.log(error);
        ctx.throw(500, 'An Error has occured');
    }
        
}
