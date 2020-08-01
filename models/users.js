'use strict'

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require ('../config');
const { addUserAnswer } = require('./quiz');

exports.getById = async (id) =>{
    try{
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT * FROM Users
        WHERE id = ${id}`;

        let data = await connection.query(sql);

        await connection.end();

        return data;

    }
    catch (error){
        throw new Error(error)
    }
}

exports.add = async (user) => {
    try{
        console.log('signup user')
        console.log(user)
        if (user.email === undefined){
            throw {message: "Email is required", status:400}
        }
        if (user.password === undefined){
            throw {message: "Password is required", status:400}
        }
        if (user.password.length < 6 ){
            throw {message: "Password must be atleast 6 chars long", status:400}
        }
        if (user.passwordConfirmation === undefined){
            throw {message: "Password confirmation is required", status:400}
        }
        else{
            if(user.password !== user.passwordConfirmation) {
                throw {message: "Passwords do not match", status:400};
            }      
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/;
        
        if(!re.test(String(user.email).toLowerCase()))
            throw{message: "invalid email address", status:400};
        
        let sql = `SELECT email from users WHERE email LIKE "${user.email}"`;

        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(sql);

        if(data.length){
            await connection.end();
            throw {message:'email address is already registered', status:400};
        }
        var salt =bcrypt.genSaltSync()
        var hash = bcrypt.hashSync(user.password, salt);

            
        let userData = {
            email: user.email,
            username: user.username,
            pwd: hash,
            pwdSalt: salt,
            created: new Date()
        }

        sql = `INSERT into Users SET ?`;

        data = await connection.query(sql, userData);

        await connection.end()

        return data;
    }catch(error){
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }

}

exports.validate = async (user) => {
    try{
        console.log(user)
        console.log("that was user")
        if (user.email === undefined){
            throw {message: "Email is required", status:400}
        }
        if (user.password === undefined){
            throw {message: "Password is required", status:400}
        }
        let userID = {id : null, username : null}
        let sql = `SELECT username, pwdSalt, pwd, id FROM users WHERE email = '${user.email}'`
        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(sql);
        console.log(data)
        console.log('that was username pwdsalt, pwd. id')
        await connection.end()
        if (bcrypt.hashSync(user.password, data[0].pwdSalt) == data[0].pwd){    
            userID = { id : data[0].id, username : data[0].username}
        }
        return userID;
    }
    catch(error){
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}