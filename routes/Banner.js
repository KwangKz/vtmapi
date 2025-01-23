const express = require('express');

const { getbanner, updbanner } = require('../controller/Banner');

const router = express.Router();
const bodyparser = require('body-parser')
const jsonparser = bodyparser.json()

// http:localhost:5000/getbanner
router.get('/getbanner', jsonparser, getbanner);

// http:localhost:5000/updbanner
// router.post('/updbanner', jsonparser, updbanner);


module.exports = router;