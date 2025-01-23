const mysql = require('mysql2/promise');

const poolConfig = {
  uri: process.env.MYSQL_URI || 'mysql://root:izDvvQGcSiuHuyqrkPHBGDAyivNNRcWL@autorack.proxy.rlwy.net:28506/railway',
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = mysql.createPool(poolConfig);

exports.getbanner = async (req, res) => {  // Using async/await for promises
  try {
    const [result] = await pool.execute('SELECT * FROM tbl_banner'); // Use await for promises
    if (result.length === 0) {
      return res.json({ status: "error", message: "No banners found" });
    }
    res.json(result);
  } catch (err) {
    return res.json({ status: "error", message: "Error: " + err.message });
  }
};