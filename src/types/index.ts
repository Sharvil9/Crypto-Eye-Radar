
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export interface Wallet {
  id: string;
  name: string;
  address: string;
  type: 'ETH' | 'BTC' | 'BSC' | 'SOL' | 'Manual' | string;
  balance: number;
  previousBalance?: number;
  assets: WalletAsset[];
}

export interface WalletAsset {
  coin: CryptoCoin;
  amount: number;
  value: number;
}

export interface PortfolioSummary {
  totalValue: number;
  previousValue: number;
  changePercentage: number;
  wallets: Wallet[];
}

export interface PriceHistoryData {
  prices: [number, number][];  // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface TransactionHistory {
  id: string;
  walletId: string;
  coinId: string;
  type: 'buy' | 'sell' | 'transfer_in' | 'transfer_out';
  amount: number;
  value: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface AlertConfig {
  id: string;
  coinId: string;
  condition: 'above' | 'below';
  price: number;
  isActive: boolean;
  createdAt: number;
}

export interface UserSettings {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD';
  theme: 'dark' | 'light';
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
  }
}
