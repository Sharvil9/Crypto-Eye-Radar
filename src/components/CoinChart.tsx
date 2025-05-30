
import React, { useState } from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid,
  ReferenceArea 
} from 'recharts';
import { CryptoCoin, PriceHistoryData } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from './ui/chart';

interface CoinChartProps {
  coin: CryptoCoin | null;
  priceHistory: PriceHistoryData | null;
  isLoading: boolean;
}

const CoinChart: React.FC<CoinChartProps> = ({ coin, priceHistory, isLoading }) => {
  const [timeRange, setTimeRange] = React.useState<'1d'>('1d');
  
  // State for zoom functionality
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  
  React.useEffect(() => {
    if (priceHistory) {
      const data = filterData();
      setChartData(data);
      setOriginalData(data);
    }
  }, [priceHistory]);
  
  if (isLoading) {
    return (
      <div className="crypto-card">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!coin || !priceHistory) {
    return (
      <div className="crypto-card">
        <p className="text-gray-400 text-center py-8">Select a coin to view chart</p>
      </div>
    );
  }

  // Filter data based on selected time range and ensure consistent data points for better visualization
  function filterData() {
    if (!priceHistory) return [];
    
    const now = Date.now();
    let filterTime = now - 24 * 60 * 60 * 1000; // Default to 24 hours
    
    // Get filtered data
    let filteredPrices = priceHistory.prices.filter(([timestamp]) => timestamp >= filterTime);
    
    // Ensure we have reasonable number of data points for better visualization
    const maxDataPoints = 24; // For 24 hours view
    
    if (filteredPrices.length > maxDataPoints) {
      const interval = Math.floor(filteredPrices.length / maxDataPoints);
      filteredPrices = filteredPrices.filter((_, index) => index % interval === 0);
    }
    
    return filteredPrices.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  };

  // Check if the coin has increased in value over the selected period
  const startPrice = chartData[0]?.price || 0;
  const endPrice = chartData[chartData.length - 1]?.price || 0;
  const isPositive = endPrice >= startPrice;
  
  const priceColor = isPositive ? "#00E396" : "#FF4560"; // Green for positive, red for negative

  // Format price for display with appropriate decimal places
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toLocaleString('en-US', { maximumFractionDigits: 8 });
    if (price < 1) return price.toLocaleString('en-US', { maximumFractionDigits: 4 });
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Zoom handling functions
  const handleMouseDown = (e: any) => {
    if (!e || !e.activeLabel) return;
    setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (refAreaLeft && e && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (refAreaLeft === refAreaRight || !refAreaRight || !refAreaLeft) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    // Order the selected timestamps
    let left = Math.min(refAreaLeft, refAreaRight);
    let right = Math.max(refAreaLeft, refAreaRight);

    // Filter data for zoom
    const zoomed = originalData.filter(
      item => item.timestamp >= left && item.timestamp <= right
    );
    
    if (zoomed.length > 0) {
      setChartData(zoomed);
      setIsZoomed(true);
    }
    
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  // Reset zoom
  const handleResetZoom = () => {
    setChartData(originalData);
    setIsZoomed(false);
  };

  return (
    <div className="crypto-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full mr-2" />
          <h2 className="text-lg font-medium text-white">{coin.name} Price Chart</h2>
        </div>
        <div className={`text-lg font-bold ${isPositive ? 'positive-value' : 'negative-value'}`}>
          ${formatPrice(coin.current_price)}
        </div>
      </div>
      
      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={priceColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={priceColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }}
              tick={{ fill: '#999' }} 
              axisLine={{ stroke: '#555' }}
              tickLine={{ stroke: '#555' }}
              minTickGap={15}
            />
            
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `$${formatPrice(value)}`}
              tick={{ fill: '#999' }} 
              axisLine={{ stroke: '#555' }}
              tickLine={{ stroke: '#555' }}
              width={80}
            />
            
            <Tooltip
              contentStyle={{ backgroundColor: '#1E1B2E', border: '1px solid #333', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={priceColor} 
              fillOpacity={1} 
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
            
            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fillOpacity={0.2}
                fill={priceColor}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        
        {isZoomed && (
          <Button 
            size="sm"
            variant="outline"
            className="absolute right-2 top-2 text-xs bg-crypto-dark/70 border-crypto-primary hover:bg-crypto-primary"
            onClick={handleResetZoom}
          >
            Reset Zoom
          </Button>
        )}
      </div>
      
      <div className="flex justify-between mt-4 gap-2">
        <Button 
          size="sm"
          variant="default"
          className="text-xs bg-crypto-primary"
        >
          Last Hours
        </Button>
        
        <div className="text-xs text-gray-400 flex items-center">
          <span>Tip: Click and drag on chart to zoom in</span>
        </div>
      </div>
    </div>
  );
};

export default CoinChart;
