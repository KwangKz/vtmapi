const mysql = require('mysql2/promise');

const poolConfig = {
    uri: process.env.MYSQL_URI,
    ssl: {
      rejectUnauthorized: false
    }
  };
  
exports.pool = mysql.createPool(poolConfig);