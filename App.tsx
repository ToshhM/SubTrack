import React, { useState, useEffect } from 'react';
import { LayoutGrid, PieChart, Calendar, Settings, Plus, Moon, Sun } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; 

import { Subscription, Currency, ExchangeRates } from './types';
import { EXCHANGE_RATES, FREE_TIER_LIMIT } from './constants';
import BentoGrid from './components/BentoGrid';
import StatsView from './components/StatsView';
import CalendarView from './components/CalendarView';
import AddModal from './components/AddModal';
import Paywall from './components/Paywall';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Initial Data using Google Favicons
const INITIAL_SUBS: Subscription[] = [
  { id: '1', name: 'Netflix', price: 15.99, currency: Currency.EUR, cycle: 'Mois', category: 'Divertissement', color: 'bg-[#FF6B6B]', firstPaymentDate: '2023-10-15', icon: 'N', logoUrl: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128' },
  { id: '2', name: 'Spotify', price: 10.99, currency: Currency.EUR, cycle: 'Mois', category: 'Divertissement', color: 'bg-[#2ECC71]', firstPaymentDate: '2023-10-20', icon: 'S', logoUrl: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128' },
  { id: '3', name: 'Adobe CC', price: 65.00, currency: Currency.EUR, cycle: 'Mois', category: 'Travail', color: 'bg-[#9B59B6]', firstPaymentDate: '2023-10-01', icon: 'A', logoUrl: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128' },
] as any;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'calendar'>('home');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('subtrack_data');
    return saved ? JSON.parse(saved) : INITIAL_SUBS;
  });
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('subtrack_theme');
    return savedTheme === 'dark';
  });

  const [baseCurrency, setBaseCurrency] = useState<Currency>(Currency.EUR);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false); 
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    localStorage.setItem('subtrack_data', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('subtrack_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleAddClick = () => {
    setEditingSubscription(null); // Reset mode edition
    if (!isPremium && subscriptions.length >= FREE_TIER_LIMIT) {
      setIsPaywallOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleEditClick = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsAddModalOpen(true);
  };

  const handleSaveSubscription = (subData: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
        // Mode Modification
        setSubscriptions(subscriptions.map(s => 
            s.id === editingSubscription.id ? { ...subData, id: s.id } : s
        ));
    } else {
        // Mode Création
        const newSub = { ...subData, id: generateId() };
        setSubscriptions([...subscriptions, newSub]);
    }
    setEditingSubscription(null);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const calculateTotal = () => {
    return subscriptions.reduce((acc, sub) => {
      let amount = sub.cycle === 'Mois' ? sub.price : sub.price / 12; // Normalize to monthly
      // Convert to base currency
      if (sub.currency !== baseCurrency) {
        amount = (amount / EXCHANGE_RATES[sub.currency]) * EXCHANGE_RATES[baseCurrency];
      }
      return acc + amount;
    }, 0);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-full`}>
        <div className="max-w-md mx-auto h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
        
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
            <div>
            <h1 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total mensuel</h1>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-baseline gap-1">
                {baseCurrency === Currency.EUR ? '€' : baseCurrency}
                {calculateTotal().toFixed(2)}
            </div>
            </div>
            
            <div className="flex gap-2">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-md active:scale-90 transition-all"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Currency Switcher Mini */}
                <button 
                onClick={() => {
                    const currencies = Object.values(Currency);
                    const nextIdx = (currencies.indexOf(baseCurrency) + 1) % currencies.length;
                    setBaseCurrency(currencies[nextIdx]);
                }}
                className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                {baseCurrency === Currency.EUR ? '€' : baseCurrency === Currency.USD ? '$' : baseCurrency === Currency.GBP ? '£' : 'Fr'}
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {activeTab === 'home' && (
            <BentoGrid 
                subscriptions={subscriptions} 
                displayCurrency={baseCurrency}
                onAdd={handleAddClick}
                onDelete={removeSubscription}
                onEdit={handleEditClick}
            />
            )}
            {activeTab === 'stats' && (
            <StatsView 
                subscriptions={subscriptions} 
                rates={EXCHANGE_RATES} 
                baseCurrency={baseCurrency} 
            />
            )}
            {activeTab === 'calendar' && (
            <CalendarView subscriptions={subscriptions} />
            )}
        </div>

        {/* Floating Action Button (Only on Home) */}
        {activeTab === 'home' && (
            <div className="absolute bottom-24 right-6 z-20">
                <button 
                    onClick={handleAddClick}
                    className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    {/* Utilisation de l'icône Plus au lieu du texte "+" pour un centrage parfait */}
                    <Plus size={32} />
                </button>
            </div>
        )}

        {/* Bottom Navigation */}
        <div className="h-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around items-center px-4 pb-2 z-30 transition-colors duration-300">
            <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<LayoutGrid size={24} />} 
            label="Home"
            />
            <NavButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<PieChart size={24} />} 
            label="Stats" 
            />
            <NavButton 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
            icon={<Calendar size={24} />} 
            label="Agenda" 
            />
        </div>

        {/* Modals */}
        <AddModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onSave={handleSaveSubscription}
            initialData={editingSubscription}
        />
        <Paywall 
            isOpen={isPaywallOpen} 
            onClose={() => setIsPaywallOpen(false)} 
        />
        </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${active ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'}`}
  >
    {React.cloneElement(icon, { strokeWidth: active ? 2.5 : 2 })}
    <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-0'} transition-opacity`}>{label}</span>
  </button>
);

export default App;