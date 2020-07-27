var mysql = require('promise-mysql');
var info = require('../config');

//get an article by its id
exports.getById = async (id) => {
    try {
        //first connect to the database
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
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
exports.getAll = async (page, limit, order)=> {
    try {
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `SELECT id, title, description, imageURL FROM quiz
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
exports.add = async (article) => {
    try {
        if (article.title === undefined){

        }
        const connection = await mysql.createConnection(info.config);
        //this is the sql statement to execute
        let sql = `INSERT INTO quiz
        SET ?
        `;
        let data = await connection.query(sql, article);
        await connection.end();
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}  

exports.update = async (id, article) => {
    try {
        const connection = await mysql.createConnection(info.config);
        let sql = `UPDATE quiz 
        SET ?
        WHERE id = ${id}`;
        let data = await connection.query(sql, article);
        await connection.end();
        return data;

    }catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }  
}

exports.delete = async (id) => {
    try {
        const connection = await mysql.createConnection(info.config);
        let sql = `DELETE FROM quiz
        WHERE id = ?`;
        let data = await connection.query(sql, id);
        await connection.end();
        return data;

    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}