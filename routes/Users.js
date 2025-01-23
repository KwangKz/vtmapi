const express = require('express');
const { list, create, update, remove } = require('../controller/Users');
const router = express.Router();
const bodyparser = require('body-parser')
const jsonparser = bodyparser.json()

router.get('/getusers', jsonparser, list)
router.post('/register', jsonparser, create)
router.post('/edituser', jsonparser, update)
router.post('/deluser', jsonparser, remove)

module.exports = router;