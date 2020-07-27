const mysql = require('mysql')

const conData = {
    host:"localhost",
    user:"root",
    password: "",
    database: "oktob"
};

exports.connect = function( callback){

    var con = mysql.createConnection({
        host: conData.host,
        user: conData.user,
        password: conData.password,
        database: conData.database
    });

    con.connect(function(err) {
        if (err) callback(err);
        callback(null, con);
    });
}; 
const pool = mysql.createPool(config);

export default pool;