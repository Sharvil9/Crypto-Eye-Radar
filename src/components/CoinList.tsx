
import React from 'react';
import { CryptoCoin } from '@/types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CoinListProps {
  coins: CryptoCoin[];
  isLoading: boolean;
  onSelectCoin: (coin: CryptoCoin) => void;
  onCoinClick?: (coin: CryptoCoin) => void;
}

const CoinList: React.FC<CoinListProps> = ({ coins, isLoading, onSelectCoin, onCoinClick }) => {
  if (isLoading) {
    return (
      <div className="crypto-card">
        <h2 className="text-xl font-medium text-gray-200 mb-4">Market Trends</h2>
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="flex items-center py-3 border-b border-gray-800">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="ml-3 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="crypto-card">
      <h2 className="text-xl font-medium text-gray-200 mb-4">Market Trends</h2>
      
      <div className="overflow-hidden">
        {coins.map((coin) => (
          <div 
            key={coin.id}
            className="flex items-center py-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors px-2 -mx-2 rounded"
            onClick={() => {
              onSelectCoin(coin);
              if (onCoinClick) onCoinClick(coin);
            }}
          >
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="w-8 h-8 rounded-full"
            />
            
            <div className="ml-3 flex-1">
              <div className="font-medium text-white">{coin.name}</div>
              <div className="text-xs text-gray-400 uppercase">{coin.symbol}</div>
            </div>
            
            <div className="text-right">
              <div className="font-medium text-white">${coin.current_price.toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: coin.current_price < 0.01 ? 8 : 2
              })}</div>
              
              <div className={`text-xs flex items-center justify-end ${coin.price_change_percentage_24h >= 0 ? 'positive-value' : 'negative-value'}`}>
                {coin.price_change_percentage_24h >= 0 
                  ? <ArrowUp size={10} className="mr-0.5" /> 
                  : <ArrowDown size={10} className="mr-0.5" />
                }
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinList;
