import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Subscription, BillingCycle, Currency, ExchangeRates, Category } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface StatsViewProps {
  subscriptions: Subscription[];
  rates: ExchangeRates;
  baseCurrency: Currency;
}

const StatsView: React.FC<StatsViewProps> = ({ subscriptions, rates, baseCurrency }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Filtrage
  const filteredSubs = selectedCategory === 'ALL' 
    ? subscriptions 
    : subscriptions.filter(s => s.category === selectedCategory);
  
  // Convert price to monthly base currency for fair comparison
  const normalizeCost = (sub: Subscription) => {
    let monthly = sub.cycle === BillingCycle.YEARLY ? sub.price / 12 : sub.price;
    if (sub.currency !== baseCurrency) {
       const toEuro = monthly / rates[sub.currency];
       monthly = toEuro * rates[baseCurrency];
    }
    return monthly;
  };

  const data = filteredSubs.map((sub, index) => ({
    name: sub.name,
    value: normalizeCost(sub),
    originalPrice: sub.price,
    originalCurrency: sub.currency,
    color: sub.color.match(/bg-\[(.*?)\]/)?.[1] || '#8884d8',
    originalIndex: index
  })).sort((a, b) => b.value - a.value);

  const totalMonthly = data.reduce((acc, curr) => acc + curr.value, 0);

  // Determine what to display in the center
  const activeItem = activeIndex !== null && data[activeIndex] ? data[activeIndex] : null;
  const centerLabel = activeItem ? activeItem.name : 'Total/Mois';
  const centerValue = activeItem ? activeItem.value : totalMonthly;
  const centerCurrency = baseCurrency;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 pt-2">
      
       {/* Filtres par catégorie - Flex shrink 0 prevents squashing */}
       <div className="flex-shrink-0 px-6 mt-2 mb-2 overflow-x-auto no-scrollbar flex gap-2 pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === 'ALL' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-gray-500 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
        >
          Tout voir
        </button>
        {Object.values(Category).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-gray-500 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      <div className="flex-shrink-0 px-6 mb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Répartition</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Appuyez sur une section pour voir les détails</p>
      </div>

      <div className="flex-1 w-full min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={(_, index) => setActiveIndex(index === activeIndex ? null : index)} // Click toggle for mobile
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={activeIndex !== null && activeIndex !== index ? 0.6 : 1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase mb-1 px-4 text-center truncate w-48">
              {centerLabel}
          </span>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
             {centerValue.toFixed(2)} <span className="text-base align-top">{centerCurrency}</span>
          </span>
        </div>
      </div>

      <div className="mt-4 px-6 pb-24 space-y-3 overflow-y-auto max-h-[300px] no-scrollbar flex-shrink-0">
        {data.map((item, i) => (
            <div 
                key={i} 
                className={`flex items-center justify-between p-3 rounded-xl shadow-sm border transition-colors cursor-pointer ${activeIndex === i ? 'bg-gray-50 border-black dark:bg-gray-800 dark:border-white' : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}
                onClick={() => setActiveIndex(i === activeIndex ? null : i)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
                </div>
                <div className="text-right">
                    <span className="block font-bold text-gray-800 dark:text-white">{item.value.toFixed(2)} {baseCurrency}</span>
                    <span className="text-xs text-gray-400">{((item.value / totalMonthly) * 100).toFixed(1)}%</span>
                </div>
            </div>
        ))}
        {data.length === 0 && (
            <p className="text-center text-gray-400 py-4">Aucune donnée pour cette catégorie.</p>
        )}
      </div>
    </div>
  );
};

export default StatsView;