//use the value stored in the environment otherwise use the default one
exports.config = {
    host: process.env.DB_HOST || "fojvtycq53b2f2kx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "d0gb7qyizgcx4yce",
    password: process.env.DB_PASSWORD || "ahhev177szx6o179",
    database: process.env.DB_DATABASE || "q74d7po7a3xyem92",
    connectionLimit: 100
}