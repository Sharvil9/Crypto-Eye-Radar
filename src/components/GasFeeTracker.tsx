
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

// Mock gas fee data
const gasNetworks = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    congestion: 'Moderate',
    fees: {
      low: 25.07,
      avg: 35.78,
      high: 45.55
    }
  },
  {
    id: 'polygon',
    name: 'Polygon',
    congestion: 'Moderate',
    fees: {
      low: 36.94,
      avg: 74.34,
      high: 103.33
    }
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    congestion: 'Low',
    fees: {
      low: 0.098,
      avg: 0.125,
      high: 0.196
    }
  },
  {
    id: 'optimism',
    name: 'Optimism',
    congestion: 'Low',
    fees: {
      low: 0.053,
      avg: 0.084,
      high: 0.195
    }
  }
];

const GasFeeTracker: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Update the "last updated" timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate minutes since last update
  const getMinutesSinceUpdate = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return diffMins;
  };
  
  // Get class based on congestion level
  const getCongestionClass = (level: string) => {
    switch(level.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'moderate':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };
  
  return (
    <div className="crypto-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-200">Gas Fee Tracker</h2>
        <div className="text-xs text-gray-400">{getMinutesSinceUpdate()} min ago</div>
      </div>
      
      <div className="space-y-4">
        {gasNetworks.map((network) => (
          <div key={network.id} className="bg-gray-800 bg-opacity-50 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">{network.name}</div>
              <div className="text-xs text-gray-400">{getMinutesSinceUpdate()} min ago</div>
            </div>
            
            <div className="mb-1">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                  style={{ width: `${Math.min(100, network.fees.avg)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs">
              <div>
                <span className="text-gray-400 mr-1">Low</span>
                <span className="text-green-400">{network.fees.low.toFixed(2)}</span>
                <span className="text-gray-500 ml-1">gwei</span>
              </div>
              <div>
                <span className="text-gray-400 mr-1">Avg</span>
                <span className="text-yellow-400">{network.fees.avg.toFixed(2)}</span>
                <span className="text-gray-500 ml-1">gwei</span>
              </div>
              <div>
                <span className="text-gray-400 mr-1">High</span>
                <span className="text-red-400">{network.fees.high.toFixed(2)}</span>
                <span className="text-gray-500 ml-1">gwei</span>
              </div>
            </div>
            
            <div className="mt-1 flex justify-between items-center text-xs">
              <span className="text-gray-400">Congestion:</span>
              <span className={getCongestionClass(network.congestion)}>{network.congestion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GasFeeTracker;
