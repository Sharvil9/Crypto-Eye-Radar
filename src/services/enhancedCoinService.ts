
import { CryptoCoin, PriceHistoryData } from '@/types';
import { fetchTrendingCoins, fetchCoinPriceHistory } from '@/utils/cryptoApi';

// Define API providers
type ApiProvider = {
  name: string;
  isAvailable: boolean;
  rateLimitHit: boolean;
  lastUsed: number;
  cooldownPeriod: number; // in milliseconds
};

/**
 * Enhanced service for cryptocurrency data with multiple API fallbacks
 */
export const enhancedCoinService = {
  // Track API providers and their status
  providers: [
    { name: 'primary-mock', isAvailable: true, rateLimitHit: false, lastUsed: 0, cooldownPeriod: 60000 },
    { name: 'coingecko', isAvailable: true, rateLimitHit: false, lastUsed: 0, cooldownPeriod: 60000 * 5 },
    { name: 'cryptocompare', isAvailable: true, rateLimitHit: false, lastUsed: 0, cooldownPeriod: 60000 * 10 },
    { name: 'coinmarketcap', isAvailable: true, rateLimitHit: false, lastUsed: 0, cooldownPeriod: 60000 * 15 },
  ] as ApiProvider[],
  
  /**
   * Get the next available API provider
   * @returns The next available API provider or null if none available
   */
  getNextAvailableProvider(): ApiProvider | null {
    const now = Date.now();
    
    // Reset providers that have cooled down
    this.providers.forEach(provider => {
      if (provider.rateLimitHit && (now - provider.lastUsed > provider.cooldownPeriod)) {
        provider.rateLimitHit = false;
        console.log(`Provider ${provider.name} cooldown complete, available again`);
      }
    });
    
    // Find next available provider
    const availableProvider = this.providers.find(p => p.isAvailable && !p.rateLimitHit);
    
    if (availableProvider) {
      availableProvider.lastUsed = now;
      return availableProvider;
    }
    
    console.warn('All API providers are rate-limited. Using first provider regardless of status.');
    // If all are rate-limited, use the first one anyway as fallback
    this.providers[0].lastUsed = now;
    return this.providers[0];
  },
  
  /**
   * Mark an API provider as rate-limited
   * @param providerName - Name of the provider
   */
  markProviderRateLimited(providerName: string): void {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider) {
      provider.rateLimitHit = true;
      provider.lastUsed = Date.now();
      console.log(`Provider ${providerName} marked as rate-limited, cooling down for ${provider.cooldownPeriod / 1000} seconds`);
    }
  },
  
  /**
   * Execute an API call with fallback mechanism
   * @param apiCall - Function that makes the API call
   * @param providerParam - Parameter to pass to the API call
   * @returns Promise with the API response
   */
  async executeWithFallback<T, P>(
    apiCall: (param: P, providerName: string) => Promise<T>,
    providerParam: P
  ): Promise<T> {
    // Copy the list to avoid modifying during iteration
    const providersCopy = [...this.providers];
    let lastError: Error | null = null;
    
    // Try each provider until one works
    for (const provider of providersCopy) {
      if (provider.isAvailable && !provider.rateLimitHit) {
        try {
          console.log(`Trying API provider: ${provider.name}`);
          provider.lastUsed = Date.now();
          const result = await apiCall(providerParam, provider.name);
          return result;
        } catch (error) {
          lastError = error as Error;
          console.error(`Error with provider ${provider.name}:`, error);
          
          // Check if it's a rate limit error
          if (error instanceof Error && 
              (error.message.includes('rate limit') || 
               error.message.includes('429') || 
               error.message.includes('too many requests'))) {
            this.markProviderRateLimited(provider.name);
          }
        }
      }
    }
    
    // If all providers failed, throw the last error
    throw lastError || new Error('All API providers failed');
  },
  
  /**
   * Fetches trending coins with fallback mechanism
   * @returns Promise resolving to an array of CryptoCoin objects
   */
  getTrendingCoins: async (): Promise<CryptoCoin[]> => {
    return enhancedCoinService.executeWithFallback<CryptoCoin[], void>(
      async (_: void, providerName: string) => {
        // In a real implementation, you would use different API calls based on provider
        // For now, we'll use our mock implementation
        console.log(`Fetching trending coins with provider: ${providerName}`);
        return fetchTrendingCoins();
      },
      void 0
    );
  },

  /**
   * Fetches price history for a specific coin with fallback mechanism
   * @param coinId - The ID of the coin
   * @returns Promise resolving to PriceHistoryData
   */
  getCoinPriceHistory: async (coinId: string): Promise<PriceHistoryData> => {
    return enhancedCoinService.executeWithFallback<PriceHistoryData, string>(
      async (id: string, providerName: string) => {
        // In a real implementation, you would use different API calls based on provider
        console.log(`Fetching price history for ${id} with provider: ${providerName}`);
        return fetchCoinPriceHistory(id);
      },
      coinId
    );
  },

  /**
   * Gets a coin by its ID with fallback mechanism
   * @param coinId - The ID of the coin to fetch
   * @returns The coin if found, undefined otherwise
   */
  getCoinById: async (coinId: string): Promise<CryptoCoin | undefined> => {
    const allCoins = await enhancedCoinService.getTrendingCoins();
    return allCoins.find(coin => coin.id === coinId);
  }
};
