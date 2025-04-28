
import React from 'react';
import { TransactionHistory as TransactionHistoryType } from '@/types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownUp, ArrowUpRight, ArrowDownRight, MoveRight } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: TransactionHistoryType[];
  isLoading: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="crypto-card animate-pulse">
        <div className="h-8 bg-gray-800 rounded-md w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-800 rounded-md w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="crypto-card">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <p className="text-gray-400 text-center py-4">No transactions found</p>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDownRight size={16} className="text-crypto-accent" />;
      case 'sell':
        return <ArrowUpRight size={16} className="text-crypto-accent-red" />;
      case 'transfer_in':
        return <ArrowDownUp size={16} className="text-crypto-accent" />;
      case 'transfer_out':
        return <MoveRight size={16} className="text-crypto-accent-red" />;
      default:
        return <ArrowDownUp size={16} />;
    }
  };

  return (
    <div className="crypto-card">
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Asset</TableHead>
              <TableHead className="text-xs">Amount</TableHead>
              <TableHead className="text-xs">Value</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center">
                    {getTransactionIcon(tx.type)}
                    <span className="ml-2 capitalize">{tx.type.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell className="uppercase">{tx.coinId}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>${tx.value.toFixed(2)}</TableCell>
                <TableCell>{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.status === 'completed' ? 'bg-green-900/30 text-green-400' : 
                    tx.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;
