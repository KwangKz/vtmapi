const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "autorack.proxy.rlwy.net",
    user: "root",
    password: "izDvvQGcSiuHuyqrkPHBGDAyivNNRcWL",
    database: "railway",
    ssl: {
        rejectUnauthorized: false,
    },
    waitForConnections: true,  // Wait for a connection to be available
    connectionLimit: 10,      // Max number of concurrent connections
    queueLimit: 0,
    connectTimeout: 30000          // No limit for connection requests
});

module.exports = pool.promise();
