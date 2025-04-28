
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PortfolioSummary } from '@/types';

interface DashboardProps {
  portfolioData: PortfolioSummary | null;
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ portfolioData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="crypto-card animate-pulse">
        <div className="h-10 bg-gray-800 rounded-md mb-4"></div>
        <div className="h-24 bg-gray-800 rounded-md mb-4"></div>
        <div className="h-12 bg-gray-800 rounded-md"></div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="crypto-card">
        <p className="text-gray-400 text-center py-8">No portfolio data available</p>
      </div>
    );
  }

  const { totalValue, changePercentage } = portfolioData;
  const isPositive = changePercentage >= 0;

  return (
    <div className="crypto-card crypto-glow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-200">Portfolio Value</h2>
        <div className={`flex items-center ${isPositive ? 'positive-value' : 'negative-value'}`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span className="ml-1 font-medium">{Math.abs(changePercentage).toFixed(2)}%</span>
        </div>
      </div>

      <div className="my-4">
        <div className="text-3xl font-bold text-white">
          ${totalValue.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </p>
      </div>

      <Separator className="my-4 bg-gray-800" />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-gray-800 bg-opacity-50 rounded-md">
          <p className="text-sm text-gray-400">Wallets</p>
          <p className="text-xl font-medium text-white">{portfolioData.wallets.length}</p>
        </div>
        <div className="p-3 bg-gray-800 bg-opacity-50 rounded-md">
          <p className="text-sm text-gray-400">Assets</p>
          <p className="text-xl font-medium text-white">
            {portfolioData.wallets.reduce((total, wallet) => total + wallet.assets.length, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
