# 💱 FixedFloat Wallet - Token Conversion API

## 📊 **Current Token Prices (USD) - January 2025**

| Token         | Symbol    | Price (USD) | Market Cap |
| ------------- | --------- | ----------- | ---------- |
| Bitcoin       | BTC       | $113,458    | $2.26T     |
| Ethereum      | ETH       | $4,779      | $577B      |
| TRON          | TRX       | $0.3615     | $34.2B     |
| Solana        | SOL       | $205.85     | $111B      |
| Polygon       | MATIC     | $0.56       | $5.5B      |
| BNB           | BNB       | $876        | $122B      |
| Tether (ETH)  | USDT_ETH  | $1.00       | $167B      |
| Tether (TRON) | USDT_TRON | $1.00       | $167B      |
| Litecoin      | LTC       | $118.20     | $9.0B      |
| Cardano       | ADA       | $0.9096     | $32.5B     |

## 🔗 **API Endpoints**

---

## 💱 **Conversion API Endpoints**

### **1. Get All Token Prices**
```http
GET /api/price
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prices": {
      "BTC": 113458,
      "ETH": 4779,
      "TRX": 0.3615,
      "SOL": 205.85,
      "MATIC": 0.56,
      "BNB": 876,
      "USDT_ETH": 1.0,
      "USDT_TRON": 1.0,
      "LTC": 118.2,
      "ADA": 0.9096
    },
    "currency": "USD",
    "timestamp": "2025-01-29T12:00:00.000Z"
  }
}
```

### **2. Get Specific Token Price**
```http
GET /api/price/BTC
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "BTC",
    "price": 113458,
    "currency": "USD",
    "timestamp": "2025-01-29T12:00:00.000Z"
  }
}
```

### **3. Convert Between Tokens**
```http
POST /api/price/convert
Content-Type: application/json

{
  "fromToken": "BTC",
  "toToken": "ETH",
  "amount": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fromToken": "BTC",
    "toToken": "ETH",
    "amount": 1,
    "convertedAmount": 23.7,
    "fromPrice": 113458,
    "toPrice": 4779,
    "usdValue": 113458
  }
}
```

### **4. Get Price History**
```http
GET /api/price/BTC/history?days=7
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "BTC",
    "history": [
      {
        "date": "2025-01-22",
        "price": 108234.5,
        "timestamp": 1737561600000
      },
      {
        "date": "2025-01-23",
        "price": 110456.75,
        "timestamp": 1737648000000
      }
    ],
    "days": 7
  }
}
```

---

## 🧪 **Testing Examples**

### **Test Conversion API:**
```bash
# Get all prices
curl -X GET http://localhost:3000/api/price

# Get BTC price
curl -X GET http://localhost:3000/api/price/BTC

# Convert 1 BTC to ETH
curl -X POST http://localhost:3000/api/price/convert \
  -H "Content-Type: application/json" \
  -d '{"fromToken": "BTC", "toToken": "ETH", "amount": 1}'

# Convert 10 ETH to SOL
curl -X POST http://localhost:3000/api/price/convert \
  -H "Content-Type: application/json" \
  -d '{"fromToken": "ETH", "toToken": "SOL", "amount": 10}'

# Convert 1000 USDT to BTC
curl -X POST http://localhost:3000/api/price/convert \
  -H "Content-Type: application/json" \
  -d '{"fromToken": "USDT_ETH", "toToken": "BTC", "amount": 1000}'
```

---

## 📱 **Frontend Integration Example**

### **JavaScript/React Example:**
```javascript
// Get all token prices
const getPrices = async () => {
  try {
    const response = await fetch("/api/price");
    const data = await response.json();
    return data.data.prices;
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
};

// Convert tokens
const convertTokens = async (fromToken, toToken, amount) => {
  try {
    const response = await fetch("/api/price/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fromToken, toToken, amount }),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error converting tokens:", error);
  }
};

// Get price history
const getPriceHistory = async (token, days = 7) => {
  try {
    const response = await fetch(`/api/price/${token}/history?days=${days}`);
    const data = await response.json();
    return data.data.history;
  } catch (error) {
    console.error("Error fetching price history:", error);
  }
};

// Example usage
const example = async () => {
  // Get current prices
  const prices = await getPrices();
  console.log("Current prices:", prices);
  
  // Convert 1 BTC to ETH
  const conversion = await convertTokens("BTC", "ETH", 1);
  console.log(`1 BTC = ${conversion.convertedAmount} ETH`);
  
  // Get BTC price history
  const history = await getPriceHistory("BTC", 30);
  console.log("BTC 30-day history:", history);
};
```

---

## 💡 **Popular Conversion Examples**

### **Bitcoin Conversions:**
- **1 BTC = 23.7 ETH** (at current prices)
- **1 BTC = 551 SOL**
- **1 BTC = 8,650 LTC**
- **1 BTC = 1,134,580 USDT**

### **Ethereum Conversions:**
- **1 ETH = 0.042 BTC**
- **1 ETH = 23.2 SOL**
- **1 ETH = 365 LTC**
- **1 ETH = 4,779 USDT**

### **Solana Conversions:**
- **1 SOL = 0.043 BTC**
- **1 SOL = 0.043 ETH**
- **1 SOL = 15.7 LTC**
- **1 SOL = 205.85 USDT**

---

## 🎯 **Key Features**

1. **Real-time Price Tracking** - Get current prices for all supported tokens
2. **Token Conversion** - Convert between any supported tokens
3. **Price History** - Historical price data for analysis
4. **USD Value Calculation** - All conversions include USD value
5. **No Authentication Required** - Public API for price and conversion data

---

**🚀 Your FixedFloat Wallet now has a simple and powerful token conversion API!**