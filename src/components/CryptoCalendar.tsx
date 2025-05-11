
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon } from 'lucide-react';

// Mock crypto events
const cryptoEvents = [
  {
    id: '1',
    title: 'Ethereum Shanghai Upgrade',
    date: new Date(2023, 5, 15),
    type: 'upgrade',
    description: 'Major Ethereum network upgrade introducing new features',
    important: true
  },
  {
    id: '2',
    title: 'Bitcoin Halving',
    date: new Date(2024, 3, 20),
    type: 'halving',
    description: 'Bitcoin mining reward halving event occurring approximately every 4 years',
    important: true
  },
  {
    id: '3',
    title: 'Solana Token Unlock',
    date: new Date(2024, 5, 5),
    type: 'unlock',
    description: 'Major token unlock event for Solana ecosystem',
    important: false
  },
  {
    id: '4',
    title: 'Cardano Vasil Hardfork',
    date: new Date(2023, 8, 12),
    type: 'hardfork',
    description: 'Scheduled hardfork to implement new features',
    important: false
  },
  {
    id: '5',
    title: 'Polygon zkEVM Launch',
    date: new Date(2023, 10, 30),
    type: 'launch',
    description: 'Launch of Polygon zkEVM mainnet',
    important: true
  }
];

const CryptoCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<typeof cryptoEvents[0] | null>(null);

  // Get events for the selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return cryptoEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get events for the current month
  const getEventsForMonth = (date: Date | undefined) => {
    if (!date) return [];
    
    return cryptoEvents.filter(event => 
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Highlight dates with events
  const dateHasEvent = (date: Date) => {
    return cryptoEvents.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get events for the selected date
  const eventsForDate = getEventsForDate(date);
  
  // Get important upcoming events
  const now = new Date();
  const upcomingEvents = cryptoEvents
    .filter(event => event.date > now && event.important)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <div className="crypto-card h-full">
      <div className="flex items-center mb-4">
        <CalendarIcon className="mr-2 text-crypto-primary" size={20} />
        <h2 className="text-xl font-medium text-gray-200">Crypto Calendar</h2>
      </div>

      <div className="flex flex-col space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border-gray-800 rounded-md"
          modifiers={{
            event: (date) => dateHasEvent(date),
          }}
          modifiersStyles={{
            event: { color: 'var(--primary)', fontWeight: '700' },
          }}
        />

        <Separator className="my-2 bg-gray-800" />

        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            {eventsForDate.length > 0 
              ? `Events on ${date?.toLocaleDateString()}` 
              : 'No events on this day'}
          </h3>
          
          {eventsForDate.length > 0 ? (
            <div className="space-y-2">
              {eventsForDate.map(event => (
                <div 
                  key={event.id}
                  className="p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-crypto-primary rounded-full text-white">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a date with events to view details</p>
          )}
        </div>

        <Separator className="my-2 bg-gray-800" />

        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Important Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <span className="text-xs text-gray-400">
                      {event.date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{event.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming important events</p>
          )}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-crypto-card border border-gray-800 rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span>{selectedEvent.date.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="px-2 py-0.5 bg-crypto-primary rounded-full text-white text-xs">
                  {selectedEvent.type}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="mt-1">{selectedEvent.description}</p>
              </div>
            </div>
            <button
              className="w-full mt-4 py-2 bg-crypto-primary hover:bg-crypto-secondary text-white rounded-md"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoCalendar;
