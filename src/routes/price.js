const express = require('express');
const { getPrice, getAllTokenPrices, convertToken, getTokenPriceHistory } = require('../controllers/priceController');

const router = express.Router();

// Get all token prices
router.get('/', getAllTokenPrices);

// Get price for a specific token
router.get('/:token', getPrice);

// Convert between tokens
router.post('/convert', convertToken);

// Get price history for a token
router.get('/:token/history', getTokenPriceHistory);

module.exports = router;