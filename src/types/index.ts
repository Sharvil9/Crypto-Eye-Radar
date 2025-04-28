
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
