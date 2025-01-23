const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const jsonparser = bodyparser.json();
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "VTMSCT";

const pool = require('./db/db'); // Assuming you are exporting a pool from db.js

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadimg');
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});
const upload = multer({ storage });

const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.MYSQLPORT || 3306;

app.use(cors());

const { readdirSync } = fs;
readdirSync('./routes').map((r) => app.use('/', require(`./routes/${r}`)));

app.get('/', (req, res) => {
    res.json({ msg: "Hello World!" });
});

app.use('/uploads', express.static('uploadimg'));

app.post('/uploadnews', upload.single('n_picture'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    try {
        await pool.execute('INSERT INTO tbl_news (n_name, n_detail, n_picture) VALUES (?, ?, ?)', 
            [req.body.n_name, req.body.n_detail, fileUrl]);
        res.json({
            message: "File uploaded successfully",
            fileUrl: fileUrl
        });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/uploadmenu', upload.single('m_picture'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
    }

    const fileurl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    try {
        await pool.execute('INSERT INTO tbl_menu (m_name, m_price, m_detail, m_picture, m_type) VALUES (?, ?, ?, ?, ?)', 
            [req.body.m_name, req.body.m_price, req.body.m_detail, fileurl, req.body.m_type]);
        res.json({
            message: "File uploaded successfully!!",
            fileurl: fileurl
        });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/editnews', upload.single('n_picture'), async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM tbl_news WHERE n_id=?', [req.body.n_id]);

        if (result.length == 0) {
            return res.json({ status: "error", message: "News not found!" });
        }

        const oldNews = result[0];
        const oldImagePath = oldNews.n_picture ? oldNews.n_picture.split('/uploads/')[1] : null;
        let newImageUrl = oldNews.n_picture;

        if (req.file) {
            newImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            if (oldImagePath) {
                const fullOldImagePath = path.join(__dirname, 'uploadimg', oldImagePath);
                fs.unlink(fullOldImagePath, (err) => {
                    if (err) console.error(`Failed to delete old image: ${err}`);
                });
            }
        }

        await pool.execute('UPDATE tbl_news SET n_name=?, n_detail=?, n_picture=? WHERE n_id=?', 
            [req.body.n_name, req.body.n_detail, newImageUrl, req.body.n_id]);

        res.json({ status: "success", message: "News updated successfully!" });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/editmenu', upload.single('m_picture'), async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM tbl_menu WHERE m_id=?', [req.body.m_id]);
        if (result.length == 0) {
            return res.json({ status: "error", message: "Menu not found" });
        }

        const oldMenu = result[0];
        const oldimgpath = oldMenu.m_picture ? oldMenu.m_picture.split('/uploads/')[1] : null;
        let newimgurl = oldMenu.m_picture;

        if (req.file) {
            newimgurl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            if (oldimgpath) {
                const fulloldimgpath = path.join(__dirname, 'uploadimg', oldimgpath);
                fs.unlink(fulloldimgpath, (err) => {
                    if (err) console.error(`Failed to delete old image: ${err}`);
                });
            }
        }

        await pool.execute('UPDATE tbl_menu SET m_name=?, m_price=?, m_type=?, m_detail=?, m_picture=? WHERE m_id=?', 
            [req.body.m_name, req.body.m_price, req.body.m_type, req.body.m_detail, newimgurl, req.body.m_id]);

        res.json({ status: "success", message: "Menu updated successfully!" });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/delnews', jsonparser, async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM tbl_news WHERE n_id=?', [req.body.n_id]);
        if (result.length === 0) {
            return res.json({ status: "error", message: "News Not Found!" });
        }

        const oldNews = result[0];
        const oldImagePath = oldNews.n_picture ? oldNews.n_picture.split('/uploads/')[1] : null;
        await pool.execute('DELETE FROM tbl_news WHERE n_id=?', [req.body.n_id]);

        if (oldImagePath) {
            const fullOldImagePath = path.join(__dirname, 'uploadimg', oldImagePath);
            fs.unlink(fullOldImagePath, (err) => {
                if (err) console.error(`Failed to delete old image: ${err}`);
            });
        }

        res.json({ status: "success", message: "Delete News Successfully!" });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/delmenu', jsonparser, async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM tbl_menu WHERE m_id=?', [req.body.m_id]);
        if (result.length === 0) {
            return res.json({ status: "error", message: "Menu not found" });
        }

        const oldMenu = result[0];
        const oldimgpath = oldMenu.m_picture ? oldMenu.m_picture.split('/uploads/')[1] : null;
        await pool.execute('DELETE FROM tbl_menu WHERE m_id=?', [req.body.m_id]);

        if (oldimgpath) {
            const fullOldImagePath = path.join(__dirname, 'uploadimg', oldimgpath);
            fs.unlink(fullOldImagePath, (err) => {
                if (err) console.error(`Failed to delete old image: ${err}`);
            });
        }

        res.json({ status: "success", message: "Menu deleted successfully!" });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/login', jsonparser, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT * FROM tbl_users WHERE email=?', [req.body.email]);
        if (users.length === 0) {
            return res.json({ status: "error", message: "No User Found!" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, users[0].password);
        if (isPasswordValid) {
            const token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' });
            res.json({
                status: "success",
                message: "Login Successfully!",
                token,
                fname: users[0].fname,
                lname: users[0].lname,
                email: users[0].email,
                tel: users[0].tel,
                urole: users[0].urole
            });
        } else {
            res.json({ status: "error", message: "Login Failed" });
        }
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.post('/authen', jsonparser, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const encoded = jwt.verify(token, secret);

        const [users] = await pool.execute('SELECT * FROM tbl_users WHERE email=?', [encoded.email]);
        if (users.length === 0) {
            return res.json({ status: "error", message: "User not found" });
        }

        res.json({
            status: "success",
            email: users[0].email,
            fname: users[0].fname,
            lname: users[0].lname,
            tel: users[0].tel,
            urole: users[0].urole,
            create_at: users[0].create_at
        });
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.get('/getnews', jsonparser, async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM tbl_news');
        res.json(result);
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.get('/getmenu', jsonparser, async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM tbl_menu');
        res.json(result);
    } catch (err) {
        res.json({ status: "error", message: err });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
