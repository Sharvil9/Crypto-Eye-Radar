
import React from 'react';
import { Wallet } from '@/types';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WalletCardProps {
  wallet: Wallet;
  onClick?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onClick }) => {
  const { toast } = useToast();
  
  const changePercentage = wallet.previousBalance ? 
    ((wallet.balance - wallet.previousBalance) / wallet.previousBalance) * 100 : 0;
  
  const isPositive = changePercentage >= 0;
  
  const copyAddress = () => {
    if (wallet.address && wallet.address !== 'Manual') {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const getExplorerUrl = () => {
    if (wallet.address === 'Manual') return null;
    
    // Mock explorer URLs based on wallet type
    switch (wallet.type) {
      case 'ETH':
        return `https://etherscan.io/address/${wallet.address}`;
      case 'BTC':
        return `https://blockstream.info/address/${wallet.address}`;
      case 'BSC':
        return `https://bscscan.com/address/${wallet.address}`;
      case 'SOL':
        return `https://explorer.solana.com/address/${wallet.address}`;
      default:
        return null;
    }
  };

  const explorerUrl = getExplorerUrl();

  return (
    <div 
      className="crypto-card hover:border-crypto-primary transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{wallet.name}</h3>
        <div className="flex items-center">
          <div className="bg-gray-800 text-xs px-2 py-1 rounded font-medium text-gray-300">
            {wallet.type}
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-2xl font-bold text-white">
          ${wallet.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </div>
        
        <div className="mt-1 flex items-center">
          <div className={`flex items-center ${isPositive ? 'positive-value' : 'negative-value'} text-sm mr-2`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="ml-1">{Math.abs(changePercentage).toFixed(2)}%</span>
          </div>
          <span className="text-xs text-gray-400">24h</span>
        </div>
      </div>
      
      {wallet.address && wallet.address !== 'Manual' && (
        <div className="mt-4 flex items-center text-xs text-gray-400">
          <span className="truncate">
            {wallet.address}
          </span>
          <button 
            className="ml-1 text-gray-500 hover:text-gray-300" 
            onClick={(e) => { e.stopPropagation(); copyAddress(); }}
          >
            <Copy size={14} />
          </button>
          {explorerUrl && (
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-gray-500 hover:text-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400">
        {wallet.assets.length} {wallet.assets.length === 1 ? 'asset' : 'assets'}
      </div>
    </div>
  );
};

export default WalletCard;
