
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, ArrowUpCircle, ArrowDownCircle, Bell } from 'lucide-react';
import { AlertConfig, CryptoCoin } from '@/types';

interface PriceAlertsProps {
  coins: CryptoCoin[];
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ coins }) => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => {
    // Try to load alerts from localStorage
    const savedAlerts = localStorage.getItem('crypto-price-alerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  
  const [newAlert, setNewAlert] = useState({
    coinId: coins.length > 0 ? coins[0].id : '',
    condition: 'above' as 'above' | 'below',
    price: '',
    isActive: true
  });

  const handleAddAlert = () => {
    if (!newAlert.coinId || !newAlert.price || isNaN(Number(newAlert.price))) {
      toast({
        title: "Invalid alert",
        description: "Please select a coin and enter a valid price",
        variant: "destructive"
      });
      return;
    }

    const alert: AlertConfig = {
      id: `alert-${Date.now()}`,
      coinId: newAlert.coinId,
      condition: newAlert.condition,
      price: Number(newAlert.price),
      isActive: newAlert.isActive,
      createdAt: Date.now()
    };

    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    localStorage.setItem('crypto-price-alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alert created",
      description: `You will be notified when ${getCoinName(alert.coinId)} goes ${alert.condition} $${alert.price}`
    });

    // Reset form
    setNewAlert({
      coinId: coins.length > 0 ? coins[0].id : '',
      condition: 'above',
      price: '',
      isActive: true
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(a => a.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('crypto-price-alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alert deleted",
      description: "Price alert has been removed"
    });
  };

  const handleToggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, isActive: !alert.isActive };
      }
      return alert;
    });
    
    setAlerts(updatedAlerts);
    localStorage.setItem('crypto-price-alerts', JSON.stringify(updatedAlerts));
    
    const alert = updatedAlerts.find(a => a.id === alertId);
    toast({
      title: alert?.isActive ? "Alert activated" : "Alert deactivated",
      description: alert?.isActive 
        ? `You will be notified when the condition is met` 
        : `You won't receive notifications for this alert`
    });
  };

  const getCoinName = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId);
    return coin ? coin.name : coinId;
  };

  const getCoinImage = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId);
    return coin ? coin.image : '';
  };

  return (
    <div className="crypto-card">
      <div className="flex items-center mb-4">
        <Bell className="mr-2 text-crypto-primary" size={20} />
        <h2 className="text-xl font-medium text-gray-200">Price Alerts</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 md:col-span-1">
              <Select 
                value={newAlert.coinId} 
                onValueChange={(value) => setNewAlert({...newAlert, coinId: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {coins.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />
                        {coin.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 md:col-span-1">
              <Select 
                value={newAlert.condition} 
                onValueChange={(value) => setNewAlert({...newAlert, condition: value as 'above' | 'below'})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Goes above</SelectItem>
                  <SelectItem value="below">Goes below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 md:col-span-1">
              <Input
                type="number"
                placeholder="Price"
                value={newAlert.price}
                onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={newAlert.isActive}
                onCheckedChange={(checked) => setNewAlert({...newAlert, isActive: checked})}
              />
              <Label>Active</Label>
            </div>
            <Button onClick={handleAddAlert} className="bg-crypto-primary hover:bg-crypto-secondary">
              Create Alert
            </Button>
          </div>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm text-gray-400">Your Alerts</h3>
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
              <div className="flex items-center">
                <img src={getCoinImage(alert.coinId)} alt={getCoinName(alert.coinId)} className="w-6 h-6 mr-2" />
                <div>
                  <p className="text-sm font-medium">{getCoinName(alert.coinId)}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    {alert.condition === 'above' ? 
                      <ArrowUpCircle size={12} className="mr-1 text-crypto-accent" /> : 
                      <ArrowDownCircle size={12} className="mr-1 text-crypto-accent-red" />
                    }
                    {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.price}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={alert.isActive}
                  onCheckedChange={() => handleToggleAlert(alert.id)}
                  size="sm"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-200 p-1 h-auto"
                >
                  <AlertTriangle size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-4">No alerts set</p>
      )}
    </div>
  );
};

export default PriceAlerts;
