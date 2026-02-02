import React from 'react';
import { Lock, Star } from 'lucide-react';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 transform">
          <Lock className="text-white" size={32} />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Passez au Premium</h2>
        <p className="text-gray-500 mb-8">
          Vous avez atteint la limite de la version gratuite. Débloquez les abonnements illimités et plus encore.
        </p>

        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-center gap-3">
             <div className="bg-green-100 p-1.5 rounded-full"><Star size={14} className="text-green-600 fill-green-600" /></div>
             <span className="font-semibold text-gray-700">Abonnements illimités</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-green-100 p-1.5 rounded-full"><Star size={14} className="text-green-600 fill-green-600" /></div>
             <span className="font-semibold text-gray-700">Notifications de paiement</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-green-100 p-1.5 rounded-full"><Star size={14} className="text-green-600 fill-green-600" /></div>
             <span className="font-semibold text-gray-700">Support iCloud Sync</span>
          </div>
        </div>

        <button 
            className="w-full py-4 bg-black text-white text-lg font-bold rounded-2xl shadow-xl active:scale-95 transition-transform"
            onClick={() => alert('Intégration Stripe/Apple Pay ici !')}
        >
            Débloquer (4,99€)
        </button>
        <button onClick={onClose} className="mt-4 text-sm font-semibold text-gray-400 hover:text-gray-600">
          Non merci, peut-être plus tard
        </button>
      </div>
    </div>
  );
};

export default Paywall;
