const express = require('express');
const { convertToken } = require('../controllers/priceController');

const router = express.Router();

// Convert between tokens
router.post('/convert', convertToken);

module.exports = router;