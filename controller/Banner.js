const mysql = require('mysql2/promise');

const poolConfig = {
    uri: process.env.MYSQL_URI || 'mysql://root:izDvvQGcSiuHuyqrkPHBGDAyivNNRcWL@autorack.proxy.rlwy.net:28506/railway',
    ssl: {
      rejectUnauthorized: false
    }
  };
  
  const pool = mysql.createPool(poolConfig);

// const { pool } = require('../db/db');

exports.getbanner = (req, res) => {
  pool.execute('SELECT * FROM tbl_banner', (err, result) => {
      if (err) {
        return res.json({ status: "error", message: "Error: " + err.message });
      }
      if (result.length === 0) {
        return res.json({ status: "error", message: "No banners found" });
      }
      res.json(result);
    });
  };