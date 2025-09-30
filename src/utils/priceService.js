// Price service for getting real-time cryptocurrency prices using CoinGecko SDK
const CoinGecko = require('coingecko-api');

// Initialize CoinGecko SDK
const CoinGeckoClient = new CoinGecko();

// Token mapping to CoinGecko IDs
const TOKEN_MAPPING = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'TRX': 'tron',
    'SOL': 'solana',
    'MATIC': 'matic-network',
    'BNB': 'binancecoin',
    'USDT_ETH': 'tether',
    'USDT_TRON': 'tether',
    'LTC': 'litecoin',
    'ADA': 'cardano'
};

// Cache for prices (5 minutes)
let priceCache = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback mock prices
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
        // Check cache first
        if (priceCache[token] && Date.now() - cacheTimestamp < CACHE_DURATION) {
            return priceCache[token];
        }

        const coinId = TOKEN_MAPPING[token];
        if (!coinId) {
            throw new Error(`Token ${token} not supported`);
        }

        // Use CoinGecko SDK to get price
        const response = await CoinGeckoClient.simple.price({
            ids: [coinId],
            vs_currencies: ['usd'],
            include_24hr_change: true
        });

        const price = response.data[coinId]?.usd;
        if (!price) {
            throw new Error(`Price not available for ${token}`);
        }

        // Update cache
        priceCache[token] = price;
        if (Object.keys(priceCache).length === 1) {
            cacheTimestamp = Date.now();
        }

        return price;
    } catch (error) {
        console.error(`Error fetching price for ${token}:`, error.message);
        // Fallback to mock data
        return MOCK_PRICES[token] || 0;
    }
};

// Get all token prices
const getAllPrices = async () => {
    try {
        // Check cache first
        if (Object.keys(priceCache).length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
            return priceCache;
        }

        // Get all supported tokens
        const tokens = Object.keys(TOKEN_MAPPING);
        const coinIds = Object.values(TOKEN_MAPPING);

        // Use CoinGecko SDK to get all prices
        const response = await CoinGeckoClient.simple.price({
            ids: coinIds,
            vs_currencies: ['usd'],
            include_24hr_change: true
        });

        const prices = {};
        tokens.forEach(token => {
            const coinId = TOKEN_MAPPING[token];
            const price = response.data[coinId]?.usd;
            if (price) {
                prices[token] = price;
            }
        });

        // Update cache
        priceCache = prices;
        cacheTimestamp = Date.now();

        return prices;
    } catch (error) {
        console.error('Error fetching all prices:', error.message);
        // Fallback to mock data
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

// Get price history using CoinGecko SDK
const getPriceHistory = async (token, days = 7) => {
    try {
        const coinId = TOKEN_MAPPING[token];
        if (!coinId) {
            throw new Error(`Token ${token} not supported`);
        }

        // Use CoinGecko SDK to get historical data
        const response = await CoinGeckoClient.coins.fetchMarketChart(coinId, {
            vs_currency: 'usd',
            days: days,
            interval: days <= 1 ? 'hourly' : 'daily'
        });

        const prices = response.data.prices;
        const history = prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toISOString().split('T')[0],
            price: parseFloat(price.toFixed(2)),
            timestamp: timestamp
        }));

        return history;
    } catch (error) {
        console.error('Price history error:', error.message);

        // Fallback to mock data
        const currentPrice = await getTokenPrice(token);
        const history = [];

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const variation = (Math.random() - 0.5) * 0.1;
            const price = currentPrice * (1 + variation);

            history.push({
                date: date.toISOString().split('T')[0],
                price: parseFloat(price.toFixed(2)),
                timestamp: date.getTime()
            });
        }

        return history;
    }
};

module.exports = {
    getTokenPrice,
    getAllPrices,
    convertTokens,
    getPriceHistory
};