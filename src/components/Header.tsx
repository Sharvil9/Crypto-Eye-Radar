
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CalendarButton from './CalendarButton';

interface HeaderProps {
  onAddWalletClick: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddWalletClick, onRefreshData, isLoading }) => {
  const { toast } = useToast();

  const handleRefresh = () => {
    onRefreshData();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest cryptocurrency prices and wallet balances."
    });
  };

  return (
    <header className="px-4 py-3 bg-crypto-dark border-b border-gray-800 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-crypto-primary flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-light bg-clip-text text-transparent">
            CryptoEye
          </h1>
        </div>
        
        <div className="flex gap-3">
          <CalendarButton />
          
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
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-crypto-primary hover:bg-crypto-secondary"
            onClick={onAddWalletClick}
          >
            <Wallet size={16} className="mr-1" />
            Add Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
