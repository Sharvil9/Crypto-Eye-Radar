
import { Wallet, PortfolioSummary, TransactionHistory } from '@/types';
import { fetchUserWallets, fetchPortfolioSummary, addWallet } from '@/utils/cryptoApi';

/**
 * Service for handling wallet operations
 */
export const walletService = {
  /**
   * Fetches user wallets
   * @returns Promise resolving to an array of Wallet objects
   */
  getUserWallets: async (): Promise<Wallet[]> => {
    return fetchUserWallets();
  },

  /**
   * Fetches portfolio summary
   * @returns Promise resolving to PortfolioSummary
   */
  getPortfolioSummary: async (): Promise<PortfolioSummary> => {
    return fetchPortfolioSummary();
  },

  /**
   * Adds a new wallet
   * @param walletData - The wallet data to add
   * @returns Promise resolving to the added Wallet
   */
  addNewWallet: async (walletData: Omit<Wallet, 'id' | 'balance' | 'assets'>): Promise<Wallet> => {
    return addWallet(walletData);
  },

  /**
   * Mock function to get transaction history for a wallet
   * @param walletId - The ID of the wallet
   * @returns Promise resolving to an array of TransactionHistory objects
   */
  getWalletTransactions: async (walletId: string): Promise<TransactionHistory[]> => {
    // This would be replaced with a real API call in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock transaction history data
    const mockTransactions: TransactionHistory[] = [
      {
        id: `tx-${Date.now()}-1`,
        walletId,
        coinId: 'bitcoin',
        type: 'buy',
        amount: 0.05,
        value: 3062.27,
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
        status: 'completed'
      },
      {
        id: `tx-${Date.now()}-2`,
        walletId,
        coinId: 'ethereum',
        type: 'buy',
        amount: 1.2,
        value: 4226.11,
        timestamp: Date.now() - 86400000 * 5, // 5 days ago
        status: 'completed'
      },
      {
        id: `tx-${Date.now()}-3`,
        walletId,
        coinId: 'bitcoin',
        type: 'sell',
        amount: 0.02,
        value: 1224.91,
        timestamp: Date.now() - 86400000 * 10, // 10 days ago
        status: 'completed'
      }
    ];
    
    return mockTransactions;
  }
};
