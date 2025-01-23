const express = require('express');

const { getbanner, updbanner } = require('../controller/Banner');

const router = express.Router();
const bodyparser = require('body-parser')
const jsonparser = bodyparser.json()

router.get('/getbanner', jsonparser, getbanner);

module.exports = router;