
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { addWallet } from '@/utils/cryptoApi';

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletAdded: () => void;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ isOpen, onClose, onWalletAdded }) => {
  const [name, setName] = useState('');
  const [walletType, setWalletType] = useState('ETH');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a wallet name",
        variant: "destructive",
      });
      return;
    }
    
    if (walletType !== 'Manual' && !address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addWallet({
        name,
        type: walletType,
        address: walletType === 'Manual' ? 'Manual' : address,
      });
      
      toast({
        title: "Wallet Added",
        description: "Your wallet has been added successfully",
      });
      
      // Reset form
      setName('');
      setWalletType('ETH');
      setAddress('');
      
      // Close modal and refresh wallets
      onWalletAdded();
      onClose();
      
    } catch (error) {
      console.error("Error adding wallet:", error);
      toast({
        title: "Error",
        description: "Failed to add wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTypeChange = (value: string) => {
    setWalletType(value);
    if (value === 'Manual') {
      setAddress('Manual');
    } else {
      setAddress('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-crypto-card border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Wallet</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My ETH Wallet"
              className="bg-crypto-dark border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Wallet Type</Label>
            <Select value={walletType} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-crypto-dark border-gray-700 text-white">
                <SelectValue placeholder="Select wallet type" />
              </SelectTrigger>
              <SelectContent className="bg-crypto-card border-gray-700 text-white">
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="BSC">Binance Smart Chain (BSC)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
                <SelectItem value="Manual">Manual Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {walletType !== 'Manual' && (
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input 
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="bg-crypto-dark border-gray-700 text-white"
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-crypto-primary hover:bg-crypto-secondary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Wallet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWalletModal;
