
import { CryptoCoin, PriceHistoryData, Wallet, PortfolioSummary } from '@/types';

// Mock data for development
const mockCoins: CryptoCoin[] = [
  { 
    id: 'bitcoin', 
    symbol: 'btc', 
    name: 'Bitcoin', 
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    current_price: 61245.32, 
    price_change_percentage_24h: 2.34, 
    market_cap: 1198456789012, 
    total_volume: 38765432198
  },
  { 
    id: 'ethereum', 
    symbol: 'eth', 
    name: 'Ethereum', 
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    current_price: 3521.76, 
    price_change_percentage_24h: 1.45, 
    market_cap: 423567890123, 
    total_volume: 21345678901
  },
  { 
    id: 'solana', 
    symbol: 'sol', 
    name: 'Solana', 
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
    current_price: 143.21, 
    price_change_percentage_24h: -0.87, 
    market_cap: 62345678901, 
    total_volume: 3234567890
  },
  { 
    id: 'binancecoin', 
    symbol: 'bnb', 
    name: 'BNB', 
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850',
    current_price: 596.34, 
    price_change_percentage_24h: -1.23, 
    market_cap: 92345678901, 
    total_volume: 2123456789
  },
  { 
    id: 'cardano', 
    symbol: 'ada', 
    name: 'Cardano', 
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860',
    current_price: 0.57, 
    price_change_percentage_24h: 5.67, 
    market_cap: 20345678901, 
    total_volume: 987654321
  },
  { 
    id: 'dogecoin', 
    symbol: 'doge', 
    name: 'Dogecoin', 
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256',
    current_price: 0.145, 
    price_change_percentage_24h: 12.34, 
    market_cap: 19876543210, 
    total_volume: 2345678901
  },
  { 
    id: 'shiba-inu', 
    symbol: 'shib', 
    name: 'Shiba Inu', 
    image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png?1622619446',
    current_price: 0.0000234, 
    price_change_percentage_24h: 15.67, 
    market_cap: 13876543210, 
    total_volume: 1876543210
  }
];

const mockWallets: Wallet[] = [
  {
    id: '1',
    name: 'Main ETH Wallet',
    address: '0x1234...5678',
    type: 'ETH',
    balance: 25690.45,
    previousBalance: 24890.12,
    assets: [
      { 
        coin: mockCoins[1], // Ethereum
        amount: 7.25,
        value: 25532.76
      },
      {
        coin: mockCoins[4], // Cardano
        amount: 276.32,
        value: 157.69
      }
    ]
  },
  {
    id: '2',
    name: 'BTC Hodl',
    address: 'bc1q...7ujm',
    type: 'BTC',
    balance: 122490.64,
    previousBalance: 119876.89,
    assets: [
      {
        coin: mockCoins[0], // Bitcoin
        amount: 2,
        value: 122490.64
      }
    ]
  },
  {
    id: '3',
    name: 'Shitcoin Portfolio',
    address: 'Manual',
    type: 'Manual',
    balance: 3507.61,
    previousBalance: 2890.34,
    assets: [
      {
        coin: mockCoins[5], // Dogecoin
        amount: 12500,
        value: 1812.5
      },
      {
        coin: mockCoins[6], // Shiba Inu
        amount: 72500000,
        value: 1695.11
      }
    ]
  }
];

// Generate mock price history data
function generateMockPriceHistory(basePrice: number, volatility: number): PriceHistoryData {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - (7 * oneDayMs);
  
  const pricePoints = 168; // 24 hours * 7 days in hours
  const timeStep = oneDayMs / 24;
  
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < pricePoints; i++) {
    const timestamp = sevenDaysAgo + (i * timeStep);
    
    // Generate random price changes with the specified volatility
    const change = basePrice * (Math.random() * volatility * 2 - volatility);
    currentPrice = Math.max(0.0000001, currentPrice + change);
    
    prices.push([timestamp, currentPrice]);
    market_caps.push([timestamp, currentPrice * 1000000]);
    total_volumes.push([timestamp, currentPrice * 500000]);
  }
  
  return { prices, market_caps, total_volumes };
}

// API mock functions
export const fetchTrendingCoins = async (): Promise<CryptoCoin[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCoins;
};

export const fetchUserWallets = async (): Promise<Wallet[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockWallets;
};

export const fetchPortfolioSummary = async (): Promise<PortfolioSummary> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const wallets = await fetchUserWallets();
  const totalValue = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const previousValue = wallets.reduce((sum, wallet) => sum + (wallet.previousBalance || 0), 0);
  const changePercentage = ((totalValue - previousValue) / previousValue) * 100;
  
  return {
    totalValue,
    previousValue,
    changePercentage,
    wallets
  };
};

export const fetchCoinPriceHistory = async (coinId: string): Promise<PriceHistoryData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const coin = mockCoins.find(c => c.id === coinId);
  if (!coin) {
    throw new Error(`Coin with ID ${coinId} not found`);
  }
  
  // Generate volatility based on coin type - more volatile for smaller coins
  let volatility = 0.01; // Default 1% volatility
  
  if (coinId === 'bitcoin') volatility = 0.015;
  else if (coinId === 'ethereum') volatility = 0.02;
  else if (coinId === 'solana') volatility = 0.03;
  else if (coinId === 'shiba-inu' || coinId === 'dogecoin') volatility = 0.05;
  
  return generateMockPriceHistory(coin.current_price, volatility);
};

export const addWallet = async (walletData: Omit<Wallet, 'id' | 'balance' | 'assets'>): Promise<Wallet> => {
  // In a real app, this would send data to the server
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock wallet with random values
  const randomBalance = Math.random() * 10000;
  const newWallet: Wallet = {
    id: `wallet-${Date.now()}`,
    ...walletData,
    balance: randomBalance,
    previousBalance: randomBalance * 0.95,
    assets: [
      {
        coin: mockCoins[Math.floor(Math.random() * mockCoins.length)],
        amount: Math.random() * 100,
        value: randomBalance
      }
    ]
  };
  
  // In a real application, we would update state here
  return newWallet;
};
