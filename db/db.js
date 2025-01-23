const mysql = require('mysql2/promise');

const poolConfig = {
    uri: process.env.MYSQL_URI || 'mysql://root:izDvvQGcSiuHuyqrkPHBGDAyivNNRcWL@autorack.proxy.rlwy.net:28506/railway',
    ssl: {
      rejectUnauthorized: false
    }
  };
  
exports.pool = mysql.createPool(poolConfig);