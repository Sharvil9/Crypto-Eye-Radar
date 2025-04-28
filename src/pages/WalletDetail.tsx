
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { walletService, coinService } from '@/services';
import { Wallet, TransactionHistory as TransactionHistoryType } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import WalletCard from '@/components/WalletCard';
import TransactionHistory from '@/components/TransactionHistory';
import CoinChart from '@/components/CoinChart';
import { useToast } from '@/components/ui/use-toast';

const WalletDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetPriceHistory, setAssetPriceHistory] = useState(null);
  const [isChartLoading, setIsChartLoading] = useState(false);
  
  const fetchWalletData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const wallets = await walletService.getUserWallets();
      const foundWallet = wallets.find(w => w.id === id);
      
      if (foundWallet) {
        setWallet(foundWallet);
        
        // If wallet has assets, select the first one by default
        if (foundWallet.assets.length > 0) {
          setSelectedAssetId(foundWallet.assets[0].coin.id);
          fetchAssetPriceHistory(foundWallet.assets[0].coin.id);
        }
      } else {
        toast({
          title: "Wallet not found",
          description: "The requested wallet could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTransactionHistory = async () => {
    if (!id) return;
    
    setIsTransactionsLoading(true);
    try {
      const txHistory = await walletService.getWalletTransactions(id);
      setTransactions(txHistory);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setIsTransactionsLoading(false);
    }
  };
  
  const fetchAssetPriceHistory = async (coinId: string) => {
    setIsChartLoading(true);
    try {
      const priceData = await coinService.getCoinPriceHistory(coinId);
      setAssetPriceHistory(priceData);
    } catch (error) {
      console.error('Error fetching asset price history:', error);
    } finally {
      setIsChartLoading(false);
    }
  };
  
  const handleAssetSelect = (coinId: string) => {
    setSelectedAssetId(coinId);
    fetchAssetPriceHistory(coinId);
  };
  
  const handleRefresh = () => {
    fetchWalletData();
    fetchTransactionHistory();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest wallet information."
    });
  };
  
  useEffect(() => {
    fetchWalletData();
    fetchTransactionHistory();
  }, [id]);
  
  const selectedAsset = wallet?.assets.find(asset => 
    asset.coin.id === selectedAssetId
  );
  
  const selectedCoin = selectedAsset?.coin;

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
        ) : wallet ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Info */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Wallet Details</h1>
              <WalletCard wallet={wallet} />
              
              <h2 className="text-xl font-medium mt-6">Assets</h2>
              <div className="space-y-4">
                {wallet.assets.map((asset) => (
                  <div 
                    key={asset.coin.id}
                    className={`crypto-card ${selectedAssetId === asset.coin.id ? 'border-crypto-primary' : ''} cursor-pointer`}
                    onClick={() => handleAssetSelect(asset.coin.id)}
                  >
                    <div className="flex items-center">
                      <img 
                        src={asset.coin.image} 
                        alt={asset.coin.name} 
                        className="w-8 h-8 mr-3"
                      />
                      <div>
                        <h3 className="font-medium">{asset.coin.name}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">{asset.amount} {asset.coin.symbol.toUpperCase()}</span>
                          <span className="text-white">${asset.value.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Asset Chart and Transactions */}
            <div className="md:col-span-2 space-y-6">
              {selectedCoin && (
                <CoinChart
                  coin={selectedCoin}
                  priceHistory={assetPriceHistory}
                  isLoading={isChartLoading}
                />
              )}
              
              <TransactionHistory
                transactions={transactions}
                isLoading={isTransactionsLoading}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium text-gray-400">Wallet not found</h1>
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

export default WalletDetail;
