
import React, { useState } from 'react';
import { Bell, Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertConfig, CryptoCoin } from '@/types';

interface PriceAlertsProps {
  coins: CryptoCoin[];
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ coins }) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([
    {
      id: "alert-1",
      coinId: "bitcoin",
      condition: "above",
      price: 50000,
      isActive: true,
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      id: "alert-2",
      coinId: "ethereum",
      condition: "below",
      price: 2000,
      isActive: true,
      createdAt: Date.now(),
    },
  ]);
  
  const [newAlert, setNewAlert] = useState<Omit<AlertConfig, "id" | "createdAt">>({
    coinId: coins.length > 0 ? coins[0].id : "",
    condition: "above",
    price: 0,
    isActive: true,
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleAddAlert = () => {
    if (!newAlert.coinId || newAlert.price <= 0) {
      toast({
        title: "Invalid alert configuration",
        description: "Please select a coin and enter a valid price",
        variant: "destructive",
      });
      return;
    }
    
    const alertId = `alert-${Date.now()}`;
    const alert: AlertConfig = {
      ...newAlert,
      id: alertId,
      createdAt: Date.now(),
    };
    
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
    setNewAlert({
      coinId: coins.length > 0 ? coins[0].id : "",
      condition: "above",
      price: 0,
      isActive: true,
    });
    setDialogOpen(false);
    
    toast({
      title: "Price Alert Created",
      description: `You will be notified when ${getCoinName(newAlert.coinId)} ${newAlert.condition === "above" ? "exceeds" : "falls below"} $${newAlert.price.toLocaleString()}`,
    });
  };
  
  const handleDeleteAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "The price alert has been removed",
    });
  };
  
  const handleToggleAlert = (id: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };
  
  const getCoinName = (coinId: string): string => {
    const coin = coins.find((c) => c.id === coinId);
    return coin ? coin.name : coinId;
  };
  
  const getCoinImage = (coinId: string): string => {
    const coin = coins.find((c) => c.id === coinId);
    return coin ? coin.image : "";
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString();
    }
    if (price >= 1) {
      return price.toFixed(2);
    }
    return price.toString();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell size={20} className="text-yellow-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Price Alerts</h2>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus size={16} />
              <span>Add Alert</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="coin">Select Coin</Label>
                <Select
                  value={newAlert.coinId}
                  onValueChange={(value) =>
                    setNewAlert({ ...newAlert, coinId: value })
                  }
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select coin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {coins.map((coin) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        <div className="flex items-center">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-5 h-5 mr-2 rounded-full"
                          />
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={newAlert.condition}
                  onValueChange={(value) =>
                    setNewAlert({ ...newAlert, condition: value as "above" | "below" })
                  }
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price falls below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="bg-gray-900 border-gray-700"
                  value={newAlert.price || ""}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newAlert.isActive}
                  onCheckedChange={() =>
                    setNewAlert({ ...newAlert, isActive: !newAlert.isActive })
                  }
                />
                <Label>Alert Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={handleAddAlert}
              >
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                alert.isActive ? "bg-gray-700/50" : "bg-gray-700/20"
              }`}
            >
              <div className="flex items-center">
                <img
                  src={getCoinImage(alert.coinId)}
                  alt={getCoinName(alert.coinId)}
                  className="w-8 h-8 mr-3 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-white">
                    {getCoinName(alert.coinId)}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {alert.condition === "above" ? "Above" : "Below"}{" "}
                    ${formatPrice(alert.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={alert.isActive}
                  onCheckedChange={() => handleToggleAlert(alert.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-700/20 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-yellow-400 mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">No Alerts Set</h3>
          <p className="text-gray-400 text-sm mb-4">
            Get notified when prices hit your targets
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Create Your First Alert
          </Button>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;
