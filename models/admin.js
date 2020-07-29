var mysql = require('promise-mysql');
var info = require('../config');


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
            length TIME, 
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
            timeUsed TIME, 
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

exports.populateTables = async (id) => {
    try{
        const connection = await mysql.createConnection(info.config);

        let sql = `INSERT INTO users 
            (email, username, pwd, pwdSalt)
            VALUES ('isaac@gmail.com', 'isaac', 'password', 'salting') 
        `;

        await connection.query(sql);

        sql = `INSERT INTO quiz
            (title, description, author, length)
            VALUES ('Inquizition', 'test quiz for the fam', 'isaac clark', '00:20:00' ),
            ('chicken','chicken description','Heather Smith', '00:20:00'),
            ('dog','dog description','Tim Clark', '00:20:00'); 
        `; 

        await connection.query(sql);

        sql = `INSERT INTO questions ( question , quizID)
        VALUES ('Who is the youngest clark child?', 1),
        ('What is the largest animal by mass?', 2), 
        ("True or false? 70% of the world's population live in the northern hemisphere.", 2),
        ('What is the capital of japan?', 2),
        ('testy westy', 3),
        ('What is the capital of japan?',3),
        ('what is the cats name?', 1);
        `; 

        await connection.query(sql);


        sql = `INSERT INTO answers
        (answer, questionID, correct)
        VALUES ('Oscar', 1, TRUE),
        ('Isaac', 1, FALSE),
        ('Faith', 1, FALSE),
        ('Pookie', 1, FALSE),
        ('Elephant',2,FALSE),
        ('Blue whale',2,TRUE),
        ('True',3,FALSE),
        ('False',3,TRUE),
        ('Tokyo',4,TRUE),
        ('Kyoto',4,FALSE),
        ('Osaka',4,FALSE),
        ('RESPONDY WONDY',5,FALSE),
        ('Tokyo',6,TRUE),
        ('Kyoto',6,FALSE),
        ('Osaka',6,FALSE),
        ('Pookie', 7, TRUE);
        `; 

        await connection.query(sql);

        await connection.end();

        return {message:"created successfully"};
        
        } catch (error) {
            console.log(error);
            ctx.throw(500, 'An Error has occured');
    }
}
