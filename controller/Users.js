const mysql = require('mysql2/promise');

const poolConfig = {
    uri: process.env.MYSQL_URI,
    ssl: {
      rejectUnauthorized: false
    }
  };
  
 const pool = mysql.createPool(poolConfig);

// const { pool } = require('../db/db');

const bcrypt = require('bcrypt')
const cryptnum = 10
const jwt = require('jsonwebtoken')
const secret = "VTMSCT"

exports.list = async (req, res) => {
    pool.execute('SELECT * FROM tbl_users', (err, result) => {
        if (err) { res.json({ status: "error", message: err }); return }
        res.json(result);

    })    
}

exports.create = async (req, res) => {
    pool.execute('SELECT * FROM tbl_users WHERE email=?',
        [req.body.email], (err, result) => {
            if (err) { res.json({ status: "error", message: err }); return }
            if (result.length > 0) { res.json({ status: "error", message: "This email already have used!" }); return }

            bcrypt.hash(req.body.password, cryptnum, (err, hash) => {
                Con.execute('INSERT INTO tbl_users (fname, lname, tel, email, password, urole) VALUES (?, ?, ?, ?, ?, ?)',
                    [req.body.fname, req.body.lname, req.body.tel, req.body.email, hash, req.body.urole], (err, result) => {
                        if (err) { res.json({ status: "error", message: err }); return }
                        res.json({ status: "success" })

                    }
                )
            })

        }
    )
};

exports.update = async (req, res) => {
    pool.execute('SELECT * FROM tbl_users WHERE email=?',
        [req.body.email], (err, result, field) => {
            
            if (err) { res.json({ status: "error", message: err }); return }
            if (result.length == 0) { res.json({ status: "error", message: "Not have this email!" }); return }

            const user = result[0];
            if (
                user.fname === req.body.fname &&
                user.lname === req.body.lname &&
                user.tel === req.body.tel &&
                user.urole === req.body.urole
            ) {
                res.json({ status: "error", message: "Change not detected!" }); return
            }

            pool.execute('UPDATE tbl_users SET fname=?, lname=?, tel=?, urole=? WHERE email=?',
                [req.body.fname, req.body.lname, req.body.tel, req.body.urole, req.body.email], (err, result) => {

                    if (err) { res.json({ status: "error", message: err }); return}

                    res.json({ status: "success", message: "User edit Successfully" });

                }
            )
        }
    )
}

exports.remove = async (req, res) => {
    pool.execute('SELECT * FROM tbl_users WHERE email=?',
        [req.body.email], (err, result, field) => {
            if (err) { res.json({ status: "error", message: "Not Found This Users!!" }); return }
            pool.execute('DELETE FROM tbl_users WHERE email=?',
                [req.body.email], (err, result, field) => {
                    if (err) { res.json({ status: "error", message: "Not Found This Users" }); return }

                    res.json({ status: "success", message: "Delete Successfully!" });

                }
            )
        }
    )
}