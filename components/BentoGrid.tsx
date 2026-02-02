import React, { useState } from 'react';
import { Subscription, Currency, BillingCycle, Category } from '../types';
import { Plus } from 'lucide-react';
import { CATEGORY_ICONS, EXCHANGE_RATES } from '../constants';

interface BentoGridProps {
  subscriptions: Subscription[];
  displayCurrency: Currency;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (sub: Subscription) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({ subscriptions, displayCurrency, onAdd, onDelete, onEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');

  // Helper pour normaliser le prix en EUR pour le tri
  const getNormalizedPrice = (sub: Subscription) => {
    let amount = sub.cycle === BillingCycle.YEARLY ? sub.price / 12 : sub.price;
    if (sub.currency !== Currency.EUR) {
      amount = amount / EXCHANGE_RATES[sub.currency];
    }
    return amount;
  };

  // Filtrage
  const filteredSubs = selectedCategory === 'ALL' 
    ? subscriptions 
    : subscriptions.filter(s => s.category === selectedCategory);

  // Tri par montant décroissant (le plus cher en premier)
  const sortedSubs = [...filteredSubs].sort((a, b) => getNormalizedPrice(b) - getNormalizedPrice(a));

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-60">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Plus size={32} className="text-gray-400 dark:text-gray-600" />
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">Aucun abonnement</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ajoutez votre premier service !</p>
        <button 
          onClick={onAdd}
          className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Ajouter
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in fade-in zoom-in duration-300">
      
      {/* Filtres par catégorie */}
      <div className="px-4 mb-4 mt-2 overflow-x-auto no-scrollbar flex gap-2">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {sortedSubs.map((sub, index) => {
          // Le premier élément (le plus cher) est mis en avant
          const isBig = index === 0 && selectedCategory === 'ALL'; 
          
          return (
            <div 
              key={sub.id}
              onClick={() => onEdit(sub)}
              className={`
                relative group overflow-hidden rounded-3xl p-5 flex flex-col justify-between shadow-sm transition-all hover:shadow-md cursor-pointer active:scale-[0.98]
                ${sub.color}
                ${isBig ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'col-span-1 aspect-square'}
              `}
            >
              {/* Delete button */}
               <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(sub.id); }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-opacity z-10"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>

              <div className="flex justify-between items-start">
                <div className={`
                  rounded-xl flex items-center justify-center backdrop-blur-sm bg-white/20 shadow-inner overflow-hidden
                  ${isBig ? 'w-14 h-14 text-3xl mb-4' : 'w-10 h-10 text-xl mb-2'}
                `}>
                  {sub.logoUrl ? (
                      <img src={sub.logoUrl} alt={sub.name} className="w-full h-full object-cover" />
                  ) : (
                      sub.icon || sub.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              <div>
                <h3 className={`font-bold truncate leading-tight text-white ${isBig ? 'text-2xl mb-1' : 'text-md mb-0.5'}`}>
                  {sub.name}
                </h3>
                <div className="flex items-baseline gap-1 text-white">
                  <span className={`font-extrabold ${isBig ? 'text-4xl' : 'text-lg'}`}>
                    {sub.currency === Currency.EUR ? '€' : sub.currency === Currency.USD ? '$' : sub.currency === Currency.GBP ? '£' : 'CHF'}
                    {sub.price}
                  </span>
                  <span className={`opacity-80 font-medium ${isBig ? 'text-lg' : 'text-xs'}`}>
                    /{sub.cycle === BillingCycle.MONTHLY ? 'mois' : 'an'}
                  </span>
                </div>
                {sub.cycle === BillingCycle.YEARLY && (
                   <p className="text-[10px] opacity-70 mt-1 text-white">
                     ~{(sub.price / 12).toFixed(2)} /mois
                   </p>
                )}
              </div>

              {/* Catégorie en bas à droite pour la grosse carte */}
              {isBig && (
                <div className="absolute bottom-5 right-5">
                   <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/20">
                      {sub.category}
                   </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Bouton "Ajouter" intégré à la grille */}
        <button 
          onClick={onAdd}
          className="col-span-1 aspect-square rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus size={32} />
          <span className="text-xs font-bold mt-2">Nouveau</span>
        </button>
      </div>
    </div>
  );
};

export default BentoGrid;