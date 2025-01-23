const mysql = require('mysql2/promise');

const poolConfig = {
    uri: process.env.MYSQL_URI,
    ssl: {
      rejectUnauthorized: false
    }
  };
  
 const pool = mysql.createPool(poolConfig);

const handleQuery = (req, res, tbl, colname, query) => {
    pool.execute(`SELECT * FROM ${tbl} WHERE ${colname} LIKE ?`,
        [`%${query}%`], (err, result) => {
        if (result.length == 0) { res.json({ status: "error", message: "Not have this menu" }); return }
        if (err) { res.json({ status: "error", message: err }); return }
        return res.json(result)

    })
}

exports.searchFilters = async (req, res, tbl, colname) => {
    const { query } = req.body
    if (query) {
        handleQuery(req, res, tbl, colname, query)
        console.log(query);
    }
}