// get the client;
import mysql from "mysql2/promise"

// create the connection to database
console.log("Creating connection pool...");
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'trangsuc',
    password: 'Ha@123456789'
})

export default pool;