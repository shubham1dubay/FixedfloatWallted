const { convertTokens } = require('../utils/priceService');

// Unused methods removed - only convertToken is needed

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

// Unused methods removed - only convertToken is needed

module.exports = {
    convertToken
};