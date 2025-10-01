// Minimal price service for token conversion only
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

// Get current price for a token
const getTokenPrice = async (token) => {
    try {
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

        return price;
    } catch (error) {
        console.error(`Error fetching price for ${token}:`, error.message);
        throw new Error(`Failed to fetch price for ${token}: ${error.message}`);
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

module.exports = {
    convertTokens
};