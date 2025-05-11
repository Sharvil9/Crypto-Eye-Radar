
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import WalletCard from '@/components/WalletCard';
import CoinList from '@/components/CoinList';
import CoinChart from '@/components/CoinChart';
import AddWalletModal from '@/components/AddWalletModal';
import DraggableGrid from '@/components/DraggableGrid';
import { coinService, walletService } from '@/services';
import { CryptoCoin, PortfolioSummary, PriceHistoryData } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<CryptoCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData | null>(null);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);

  // Initial data fetching
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [portfolioData, coinsData] = await Promise.all([
        walletService.getPortfolioSummary(),
        coinService.getTrendingCoins()
      ]);
      
      setPortfolio(portfolioData);
      setTrendingCoins(coinsData);
      
      // Default selected coin
      if (coinsData.length > 0 && !selectedCoin) {
        setSelectedCoin(coinsData[0]);
        fetchCoinChartData(coinsData[0].id);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch coin chart data
  const fetchCoinChartData = async (coinId: string) => {
    setIsChartLoading(true);
    try {
      const data = await coinService.getCoinPriceHistory(coinId);
      setPriceHistory(data);
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setIsChartLoading(false);
    }
  };
  
  // Handle coin selection
  const handleSelectCoin = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    fetchCoinChartData(coin.id);
  };

  // Handle coin click to navigate to detail page
  const handleCoinClick = (coin: CryptoCoin) => {
    navigate(`/coin/${coin.id}`);
  };

  // Handle wallet click to view details
  const handleWalletClick = (walletId: string) => {
    navigate(`/wallet/${walletId}`);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Prepare grid components with proper height styles to fit the grid
  const dashboardComponent = (
    <Dashboard 
      portfolioData={portfolio} 
      isLoading={isLoading}
    />
  );

  const walletsComponent = (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-medium text-gray-200 mb-4">Your Wallets</h2>
      {isLoading ? (
        <div className="space-y-4 flex-grow">
          {[1, 2].map((i) => (
            <div key={i} className="crypto-card animate-pulse">
              <div className="h-6 bg-gray-800 rounded-md w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-800 rounded-md w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded-md w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded-md w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : portfolio?.wallets && portfolio.wallets.length > 0 ? (
        <div className="space-y-4 flex-grow">
          {portfolio.wallets.map((wallet) => (
            <WalletCard 
              key={wallet.id} 
              wallet={wallet} 
              onClick={() => handleWalletClick(wallet.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <p className="text-gray-400 text-center py-8">No wallets added yet</p>
          <button
            className="mt-auto py-3 bg-crypto-primary hover:bg-crypto-secondary text-white rounded-md font-medium transition-colors"
            onClick={() => setIsAddWalletModalOpen(true)}
          >
            Add Your First Wallet
          </button>
        </div>
      )}
    </div>
  );

  const chartComponent = (
    <CoinChart 
      coin={selectedCoin} 
      priceHistory={priceHistory} 
      isLoading={isLoading || isChartLoading} 
    />
  );

  const coinListComponent = (
    <CoinList 
      coins={trendingCoins} 
      isLoading={isLoading}
      onSelectCoin={handleSelectCoin}
      onCoinClick={handleCoinClick}
    />
  );

  // Map of grid components
  const gridComponents = [
    dashboardComponent,
    walletsComponent,
    chartComponent,
    coinListComponent
  ];

  return (
    <div className="min-h-screen bg-crypto-background text-white">
      <Header 
        onAddWalletClick={() => setIsAddWalletModalOpen(true)}
        onRefreshData={fetchData}
        isLoading={isLoading}
      />
      
      <main className="container mx-auto py-6 px-4">
        <DraggableGrid id="main-dashboard">
          {gridComponents}
        </DraggableGrid>
      </main>
      
      {/* Add Wallet Modal */}
      <AddWalletModal 
        isOpen={isAddWalletModalOpen}
        onClose={() => setIsAddWalletModalOpen(false)}
        onWalletAdded={fetchData}
      />
    </div>
  );
};

export default Index;
