const express = require('express');

const { searchFilters } = require('../controller/Search');

const router = express.Router();
const bodyparser = require('body-parser')
const jsonparser = bodyparser.json()

// http://localhost:5000/search/menu
router.post('/search/menu', jsonparser, (req, res) => searchFilters(req, res, 'tbl_menu', 'm_name'))

// http://localhost:5000/search/news
router.post('/search/news', jsonparser, (req, res) => searchFilters(req, res, 'tbl_news', 'n_name'))

// http://localhost:5000/search/users
router.post('/search/users', jsonparser, (req, res) => searchFilters(req, res, 'tbl_users', 'fname'))

module.exports = router;