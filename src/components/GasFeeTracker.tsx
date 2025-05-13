
import React, { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon, Clock, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GasFee {
  network: string;
  low: number;
  average: number;
  high: number;
  unit: string;
  updated: string;
}

const GasFeeTracker = () => {
  const [gasFees, setGasFees] = useState<GasFee[]>([
    {
      network: 'Ethereum',
      low: 25,
      average: 35,
      high: 50,
      unit: 'gwei',
      updated: '1 min ago',
    },
    {
      network: 'Polygon',
      low: 35,
      average: 75,
      high: 140,
      unit: 'gwei',
      updated: '2 mins ago',
    },
    {
      network: 'Arbitrum',
      low: 0.1,
      average: 0.12,
      high: 0.25,
      unit: 'gwei',
      updated: '30 secs ago',
    },
    {
      network: 'Optimism',
      low: 0.05,
      average: 0.08,
      high: 0.15,
      unit: 'gwei',
      updated: '1 min ago',
    },
  ]);
  
  const [networkCongestion, setNetworkCongestion] = useState({
    Ethereum: 65,
    Polygon: 45,
    Arbitrum: 25,
    Optimism: 30,
  });
  
  // Simulated data fetching for gas fees
  useEffect(() => {
    const simulateGasFeeChanges = () => {
      setGasFees(prevFees => 
        prevFees.map(fee => ({
          ...fee,
          low: Math.max(fee.low * (0.95 + Math.random() * 0.1), 0.01),
          average: Math.max(fee.average * (0.95 + Math.random() * 0.1), 0.05),
          high: Math.max(fee.high * (0.95 + Math.random() * 0.1), 0.1),
          updated: '1 min ago',
        }))
      );
      
      setNetworkCongestion(prev => ({
        Ethereum: Math.min(Math.max(prev.Ethereum + (Math.random() * 10 - 5), 5), 95),
        Polygon: Math.min(Math.max(prev.Polygon + (Math.random() * 10 - 5), 5), 95),
        Arbitrum: Math.min(Math.max(prev.Arbitrum + (Math.random() * 10 - 5), 5), 95),
        Optimism: Math.min(Math.max(prev.Optimism + (Math.random() * 10 - 5), 5), 95),
      }));
    };
    
    const interval = setInterval(simulateGasFeeChanges, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Helper to determine gas fee status color
  const getStatusColor = (congestion: number) => {
    if (congestion < 30) return 'text-green-500';
    if (congestion < 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Helper to determine congestion status
  const getCongestionStatus = (congestion: number) => {
    if (congestion < 30) return 'Low';
    if (congestion < 70) return 'Moderate';
    return 'High';
  };

  // Helper to determine progress bar color
  const getProgressColor = (congestion: number) => {
    if (congestion < 30) return 'bg-green-500';
    if (congestion < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Gas Fee Tracker</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={18} className="text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                Gas fees represent the cost to perform transactions on blockchain networks.
                Lower fees = cheaper transactions. Values update every 5 seconds.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        {gasFees.map((fee) => (
          <div key={fee.network} className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(networkCongestion[fee.network as keyof typeof networkCongestion])} mr-2`}></div>
                <h3 className="font-medium text-white">{fee.network}</h3>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock size={12} className="mr-1" />
                <span>{fee.updated}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <Progress 
                value={networkCongestion[fee.network as keyof typeof networkCongestion]} 
                className="h-2 bg-gray-600"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-400">Congestion:</span>
                <span className={`ml-1 ${getStatusColor(networkCongestion[fee.network as keyof typeof networkCongestion])}`}>
                  {getCongestionStatus(networkCongestion[fee.network as keyof typeof networkCongestion])}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Low</div>
                  <div className="font-medium text-green-500">{fee.low} {fee.unit}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-400">Avg</div>
                  <div className="font-medium text-yellow-500">{fee.average} {fee.unit}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-400">High</div>
                  <div className="font-medium text-red-500">{fee.high} {fee.unit}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GasFeeTracker;
