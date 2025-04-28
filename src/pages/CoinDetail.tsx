
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coinService } from '@/services';
import { CryptoCoin } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import CoinChart from '@/components/CoinChart';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [coin, setCoin] = useState<CryptoCoin | null>(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  
  const fetchCoinData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const coinData = await coinService.getCoinById(id);
      
      if (coinData) {
        setCoin(coinData);
        fetchCoinPriceHistory(coinData.id);
      } else {
        toast({
          title: "Coin not found",
          description: "The requested cryptocurrency could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
      
    } catch (error) {
      console.error('Error fetching coin data:', error);
      toast({
        title: "Error",
        description: "Failed to load cryptocurrency data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCoinPriceHistory = async (coinId: string) => {
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
  
  const handleRefresh = () => {
    fetchCoinData();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest cryptocurrency information."
    });
  };
  
  useEffect(() => {
    fetchCoinData();
  }, [id]);
  
  // Format numbers for better display
  const formatNumber = (num: number | undefined, decimals = 2): string => {
    if (num === undefined) return 'N/A';
    
    // For very small numbers (like some token prices)
    if (Math.abs(num) < 0.01 && num !== 0) {
      return num.toExponential(decimals);
    }
    
    // For large numbers add commas
    return num.toLocaleString('en-US', { 
      maximumFractionDigits: decimals, 
      minimumFractionDigits: decimals 
    });
  };
  
  const formatMarketCap = (marketCap: number | undefined): string => {
    if (marketCap === undefined) return 'N/A';
    
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`; // Trillions
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;   // Billions
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;   // Millions
    return `$${formatNumber(marketCap)}`;
  };

  return (
    <div className="min-h-screen bg-crypto-background text-white">
      <header className="px-4 py-3 bg-crypto-dark border-b border-gray-800 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        {isLoading ? (
          <div className="crypto-card animate-pulse">
            <div className="h-8 bg-gray-800 rounded-md w-1/3 mb-4"></div>
            <div className="h-24 bg-gray-800 rounded-md mb-4"></div>
          </div>
        ) : coin ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coin Overview */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Coin Details</h1>
              <div className="crypto-card">
                <div className="flex items-center">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-12 h-12 mr-4" 
                  />
                  <div>
                    <h2 className="text-xl font-bold">{coin.name}</h2>
                    <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price</span>
                    <div className="text-xl font-semibold">
                      ${formatNumber(coin.current_price, 4)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">24h Change</span>
                    <div className={`${coin.price_change_percentage_24h >= 0 ? 'positive-value' : 'negative-value'} text-lg font-semibold`}>
                      {formatNumber(coin.price_change_percentage_24h)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Cap</span>
                    <div className="text-lg font-semibold">
                      {formatMarketCap(coin.market_cap)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volume (24h)</span>
                    <div className="text-lg font-semibold">
                      ${formatNumber(coin.total_volume, 0)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <a
                    href={`https://www.coingecko.com/en/coins/${coin.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-crypto-primary hover:text-crypto-secondary transition-colors"
                  >
                    View on CoinGecko
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Price Chart */}
            <div className="md:col-span-2 space-y-6">
              <CoinChart
                coin={coin}
                priceHistory={priceHistory}
                isLoading={isChartLoading}
              />
              
              <div className="crypto-card">
                <h2 className="text-xl font-bold mb-4">About {coin.name}</h2>
                <p className="text-gray-300">
                  {/* In a real app, this would come from the API */}
                  {coin.name} ({coin.symbol.toUpperCase()}) is a cryptocurrency with a current price of ${formatNumber(coin.current_price, 4)}. 
                  It has a market cap of {formatMarketCap(coin.market_cap)} and a 24h trading volume of ${formatNumber(coin.total_volume, 0)}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium text-gray-400">Cryptocurrency not found</h1>
            <Button 
              className="mt-4 bg-crypto-primary hover:bg-crypto-secondary"
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoinDetail;
