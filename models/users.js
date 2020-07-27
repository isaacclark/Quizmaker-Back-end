'use strict'

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require ('../config');

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

        if (user.forename === undefined)
            user.forename = null;
        if (user.surname === undefined)
            user.surname = null;
            
        let userData = {
            email: user.email,
            pwd: hash,
            forename: user.forename,
            surname: user.surname,
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