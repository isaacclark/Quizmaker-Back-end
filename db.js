const mysql = require('mysql')

const conData = {
    host:"fojvtycq53b2f2kx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user:"d0gb7qyizgcx4yce",
    password: "ahhev177szx6o179",
    database: "q74d7po7a3xyem92"
};

//connection needs to be established before any actions can be perforned on the db
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