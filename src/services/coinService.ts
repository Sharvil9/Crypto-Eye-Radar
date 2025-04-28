
import { CryptoCoin, PriceHistoryData } from '@/types';
import { mockCoins, fetchTrendingCoins, fetchCoinPriceHistory } from '@/utils/cryptoApi';

/**
 * Service for handling cryptocurrency data operations
 */
export const coinService = {
  /**
   * Fetches trending coins
   * @returns Promise resolving to an array of CryptoCoin objects
   */
  getTrendingCoins: async (): Promise<CryptoCoin[]> => {
    return fetchTrendingCoins();
  },

  /**
   * Fetches price history for a specific coin
   * @param coinId - The ID of the coin
   * @returns Promise resolving to PriceHistoryData
   */
  getCoinPriceHistory: async (coinId: string): Promise<PriceHistoryData> => {
    return fetchCoinPriceHistory(coinId);
  },

  /**
   * Gets a coin by its ID
   * @param coinId - The ID of the coin to fetch
   * @returns The coin if found, undefined otherwise
   */
  getCoinById: (coinId: string): CryptoCoin | undefined => {
    return mockCoins.find(coin => coin.id === coinId);
  }
};
