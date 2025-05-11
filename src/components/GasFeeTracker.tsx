
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, Timer } from 'lucide-react';

interface GasFee {
  network: string;
  speed: 'slow' | 'standard' | 'fast' | 'rapid';
  price: number;
  estimatedTime: string;
}

const GasFeeTracker: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [gasFees, setGasFees] = useState<Record<string, GasFee[]>>({});
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');

  // Simulated gas fees - in a real app, these would come from an API
  const mockGasFees: Record<string, GasFee[]> = {
    ethereum: [
      { network: 'ethereum', speed: 'slow', price: 25, estimatedTime: '10-15 min' },
      { network: 'ethereum', speed: 'standard', price: 35, estimatedTime: '3-5 min' },
      { network: 'ethereum', speed: 'fast', price: 45, estimatedTime: '1-2 min' },
      { network: 'ethereum', speed: 'rapid', price: 60, estimatedTime: '<30 sec' },
    ],
    polygon: [
      { network: 'polygon', speed: 'slow', price: 50, estimatedTime: '5-10 min' },
      { network: 'polygon', speed: 'standard', price: 80, estimatedTime: '2-4 min' },
      { network: 'polygon', speed: 'fast', price: 120, estimatedTime: '1 min' },
      { network: 'polygon', speed: 'rapid', price: 150, estimatedTime: '<30 sec' },
    ],
    arbitrum: [
      { network: 'arbitrum', speed: 'slow', price: 0.1, estimatedTime: '3-5 min' },
      { network: 'arbitrum', speed: 'standard', price: 0.15, estimatedTime: '1-2 min' },
      { network: 'arbitrum', speed: 'fast', price: 0.2, estimatedTime: '<1 min' },
      { network: 'arbitrum', speed: 'rapid', price: 0.25, estimatedTime: '<30 sec' },
    ],
  };

  useEffect(() => {
    const fetchGasFees = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setGasFees(mockGasFees);
      } catch (error) {
        console.error('Error fetching gas fees:', error);
        toast({
          title: "Failed to load gas fees",
          description: "Couldn't retrieve the latest gas prices",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGasFees();
    
    // Refresh gas fees every minute
    const interval = setInterval(fetchGasFees, 60000);
    return () => clearInterval(interval);
  }, [toast]);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'slow': return 'bg-yellow-600';
      case 'standard': return 'bg-green-600';
      case 'fast': return 'bg-blue-600';
      case 'rapid': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getMaxPrice = () => {
    if (!gasFees[selectedNetwork]) return 100;
    return Math.max(...gasFees[selectedNetwork].map(fee => fee.price)) * 1.2;
  };

  const getNetworkUnit = (network: string) => {
    switch (network) {
      case 'ethereum': return 'Gwei';
      case 'polygon': return 'Gwei';
      case 'arbitrum': return 'USD';
      default: return 'Units';
    }
  };

  return (
    <div className="crypto-card h-full">
      <div className="flex items-center mb-4">
        <Timer className="mr-2 text-crypto-primary" size={20} />
        <h2 className="text-xl font-medium text-gray-200">Gas Fee Tracker</h2>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2 mb-4">
          {Object.keys(mockGasFees).map(network => (
            <button
              key={network}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedNetwork === network 
                  ? 'bg-crypto-primary text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setSelectedNetwork(network)}
            >
              {network.charAt(0).toUpperCase() + network.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center">
                <div className="w-24 h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="flex-1 mx-4">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-4 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : gasFees[selectedNetwork] ? (
          <div className="space-y-4">
            {gasFees[selectedNetwork].map(fee => (
              <div key={fee.speed} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="capitalize text-sm font-medium">{fee.speed}</div>
                  <div className="flex items-center text-sm">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    <span className="text-gray-400">{fee.estimatedTime}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Progress 
                    value={(fee.price / getMaxPrice()) * 100} 
                    className="flex-1 h-2"
                    indicatorClassName={getSpeedColor(fee.speed)}
                  />
                  <span className="ml-2 text-sm font-mono">{fee.price} {getNetworkUnit(selectedNetwork)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No gas data available for {selectedNetwork}</p>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-4">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">Gas prices are estimates and may vary. Always check your wallet before confirming transactions.</p>
      </div>
    </div>
  );
};

export default GasFeeTracker;
