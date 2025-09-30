const { getTokenPrice, getAllPrices, convertTokens, getPriceHistory } = require('../utils/priceService');

// Get price for a specific token
const getPrice = async (req, res) => {
    try {
        const { token } = req.params;
        const price = await getTokenPrice(token.toUpperCase());

        res.json({
            success: true,
            data: {
                token: token.toUpperCase(),
                price: price,
                currency: 'USD',
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Get price error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch price', error: error.message });
    }
};

// Get all token prices
const getAllTokenPrices = async (req, res) => {
    try {
        const prices = await getAllPrices();

        res.json({
            success: true,
            data: {
                prices: prices,
                currency: 'USD',
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Get all prices error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch prices', error: error.message });
    }
};

// Convert between tokens
const convertToken = async (req, res) => {
    try {
        const { fromToken, toToken, amount } = req.body;

        if (!fromToken || !toToken || !amount) {
            return res.status(400).json({
                success: false,
                message: 'fromToken, toToken, and amount are required'
            });
        }

        const conversion = await convertTokens(fromToken.toUpperCase(), toToken.toUpperCase(), parseFloat(amount));

        res.json({
            success: true,
            data: conversion
        });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ success: false, message: 'Conversion failed', error: error.message });
    }
};

// Get price history for a token
const getTokenPriceHistory = async (req, res) => {
    try {
        const { token } = req.params;
        const { days = 7 } = req.query;

        const history = await getPriceHistory(token.toUpperCase(), parseInt(days));

        res.json({
            success: true,
            data: {
                token: token.toUpperCase(),
                history: history,
                days: parseInt(days)
            }
        });
    } catch (error) {
        console.error('Price history error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch price history', error: error.message });
    }
};

module.exports = {
    getPrice,
    getAllTokenPrices,
    convertToken,
    getTokenPriceHistory
};