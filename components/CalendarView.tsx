import React, { useState } from 'react';
import { Subscription, BillingCycle } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  subscriptions: Subscription[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ subscriptions }) => {
  const [offsetMonth, setOffsetMonth] = useState(0); // 0 = current month

  const today = new Date();
  // Calcul de la date affichée (année/mois)
  const displayDate = new Date(today.getFullYear(), today.getMonth() + offsetMonth, 1);
  const currentMonth = displayDate.getMonth();
  const currentYear = displayDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  // Helper: shift day so Monday is 0 (France format)
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; 

  const getSubsForDay = (day: number) => {
    return subscriptions.filter(sub => {
      const start = new Date(sub.firstPaymentDate);
      const subDay = start.getDate();
      
      // Simple logic: if monthly, it hits every month on that day.
      // If yearly, checks month and day.
      if (sub.cycle === BillingCycle.MONTHLY) {
        return subDay === day;
      } else {
        return subDay === day && start.getMonth() === currentMonth;
      }
    });
  };

  // Helper pour trouver l'abonnement le plus cher d'un jour donné
  const getMostExpensiveSub = (subs: Subscription[]) => {
      if (subs.length === 0) return null;
      return subs.reduce((prev, current) => (prev.price > current.price) ? prev : current);
  };

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const changeMonth = (delta: number) => {
    setOffsetMonth(prev => prev + delta);
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{monthNames[currentMonth]}</h2>
           <p className="text-gray-500 dark:text-gray-400">{currentYear}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white">
                <ChevronLeft size={20} />
            </button>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white">
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
          <div key={d} className="text-xs font-bold text-gray-400 dark:text-gray-500 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
           <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {daysArray.map(day => {
          const subs = getSubsForDay(day);
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const topSub = getMostExpensiveSub(subs);
          
          return (
            <div key={day} className={`
              aspect-square rounded-xl border flex flex-col items-center justify-start pt-1.5 relative transition-all overflow-hidden
              ${topSub ? topSub.color : isToday ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'}
              ${topSub ? 'text-white border-transparent' : ''}
            `}>
              <span className="text-xs font-bold z-10">{day}</span>
              
              <div className="flex flex-wrap justify-center gap-0.5 mt-1 w-full px-1 z-10">
                {subs.slice(0, 3).map((sub, idx) => ( // Max 3 dots
                   <div 
                     key={sub.id} 
                     className={`w-1.5 h-1.5 rounded-full ${topSub ? 'bg-white' : sub.color.replace('bg-', 'bg-')}`}
                   ></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">À venir ce mois-ci</h3>
        <div className="space-y-3">
          {subscriptions
            .filter(sub => {
                const day = new Date(sub.firstPaymentDate).getDate();
                // Affiche tout le mois si on n'est pas dans le mois courant, sinon seulement le futur
                if (currentMonth !== today.getMonth()) return true;
                return day >= today.getDate();
            })
            .sort((a, b) => new Date(a.firstPaymentDate).getDate() - new Date(b.firstPaymentDate).getDate())
            .map(sub => (
                <div key={sub.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-transparent dark:border-gray-700">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${sub.color} text-white font-bold`}>
                         {new Date(sub.firstPaymentDate).getDate()}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800 dark:text-white">{sub.name}</p>
                        {currentMonth === today.getMonth() ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dans {new Date(sub.firstPaymentDate).getDate() - today.getDate()} jours</p>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Le {new Date(sub.firstPaymentDate).getDate()}</p>
                        )}
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">{sub.price} {sub.currency}</p>
                </div>
            ))
          }
          {subscriptions.length === 0 && (
             <p className="text-center text-gray-400 text-sm py-4">Rien d'autre prévu ce mois-ci ! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;