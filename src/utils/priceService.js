// Price service for getting real-time cryptocurrency prices

// Mock price data (in production, you would fetch from a real API)
const MOCK_PRICES = {
    'BTC': 113458,
    'ETH': 4779,
    'TRX': 0.3615,
    'SOL': 205.85,
    'MATIC': 0.56,
    'BNB': 876,
    'USDT_ETH': 1.00,
    'USDT_TRON': 1.00,
    'LTC': 118.20,
    'ADA': 0.9096
};

// Get current price for a token
const getTokenPrice = async (token) => {
    try {
        // In production, you would call a real API like CoinGecko, CoinMarketCap, etc.
        // For now, we'll use mock data
        return MOCK_PRICES[token] || 0;
    } catch (error) {
        console.error(`Error fetching price for ${token}:`, error);
        return MOCK_PRICES[token] || 0;
    }
};

// Get all token prices
const getAllPrices = async () => {
    try {
        return MOCK_PRICES;
    } catch (error) {
        console.error('Error fetching all prices:', error);
        return MOCK_PRICES;
    }
};

// Calculate conversion between two tokens
const convertTokens = async (fromToken, toToken, amount) => {
    try {
        const fromPrice = await getTokenPrice(fromToken);
        const toPrice = await getTokenPrice(toToken);

        if (fromPrice === 0 || toPrice === 0) {
            throw new Error('Invalid token or price not available');
        }

        // Convert to USD first, then to target token
        const usdValue = amount * fromPrice;
        const convertedAmount = usdValue / toPrice;

        return {
            fromToken,
            toToken,
            amount,
            convertedAmount,
            fromPrice,
            toPrice,
            usdValue
        };
    } catch (error) {
        console.error('Conversion error:', error);
        throw error;
    }
};

// Get price history (mock data)
const getPriceHistory = async (token, days = 7) => {
    try {
        const currentPrice = await getTokenPrice(token);
        const history = [];

        // Generate mock historical data
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Add some random variation to the price
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const price = currentPrice * (1 + variation);

            history.push({
                date: date.toISOString().split('T')[0],
                price: parseFloat(price.toFixed(2)),
                timestamp: date.getTime()
            });
        }

        return history;
    } catch (error) {
        console.error('Price history error:', error);
        throw error;
    }
};

module.exports = {
    getTokenPrice,
    getAllPrices,
    convertTokens,
    getPriceHistory
};