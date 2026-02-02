import React, { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { BillingCycle, Category, Currency, Subscription } from '../types';
import { BRAND_COLORS, CATEGORY_ICONS, POPULAR_SERVICES } from '../constants';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Omit<Subscription, 'id'>) => void;
  initialData?: Subscription | null;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState(Currency.EUR);
  const [cycle, setCycle] = useState(BillingCycle.MONTHLY);
  const [category, setCategory] = useState(Category.ENTERTAINMENT);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<typeof POPULAR_SERVICES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize form with data or defaults
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price.toString());
            setCurrency(initialData.currency);
            setCycle(initialData.cycle);
            setCategory(initialData.category);
            setDate(initialData.firstPaymentDate);
            setLogoUrl(initialData.logoUrl);
            
            // Find color index
            const colorIdx = BRAND_COLORS.findIndex(c => c.bg === initialData.color);
            setSelectedColorIndex(colorIdx !== -1 ? colorIdx : 0);
        } else {
            // Reset fields
            setName('');
            setPrice('');
            setCurrency(Currency.EUR);
            setCycle(BillingCycle.MONTHLY);
            setCategory(Category.ENTERTAINMENT);
            setSelectedColorIndex(0);
            setDate(new Date().toISOString().split('T')[0]);
            setLogoUrl(undefined);
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    // Reset logo if user types manually unless it matches a service
    if (!value) setLogoUrl(undefined);

    if (value.length > 0) {
      const filtered = POPULAR_SERVICES.filter(s => 
        s.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (service: typeof POPULAR_SERVICES[0]) => {
    setName(service.name);
    setPrice(service.price.toString());
    setCategory(service.category);
    // Find matching color or default to 0
    setSelectedColorIndex(service.colorIndex < BRAND_COLORS.length ? service.colorIndex : 0);
    
    // Set Logo URL via Google Favicons API (More reliable than Clearbit)
    if (service.domain) {
        setLogoUrl(`https://www.google.com/s2/favicons?domain=${service.domain}&sz=128`);
    }

    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      price: parseFloat(price) || 0,
      currency,
      cycle,
      category,
      color: BRAND_COLORS[selectedColorIndex].bg,
      firstPaymentDate: date,
      icon: CATEGORY_ICONS[category],
      logoUrl: logoUrl
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-900 w-full sm:w-[450px] sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {initialData ? 'Modifier l\'abonnement' : 'Nouvel abonnement'}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Name Input with Autocomplete */}
          <div className="relative" ref={wrapperRef}>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nom du service</label>
            <div className="relative">
                <input 
                type="text" 
                required
                placeholder="Netflix, Spotify..."
                value={name}
                onChange={handleNameChange}
                onFocus={() => name.length > 0 && setShowSuggestions(true)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-black dark:focus:border-white focus:ring-0 transition-all font-semibold text-lg text-gray-900 dark:text-white placeholder-gray-400 pl-4 pr-12"
                />
                {logoUrl && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-48 overflow-y-auto z-10 no-scrollbar">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 border-b border-gray-50 dark:border-gray-700 last:border-0"
                  >
                    <div className={`w-8 h-8 rounded-lg ${BRAND_COLORS[s.colorIndex].bg} flex items-center justify-center text-xs text-white overflow-hidden bg-white`}>
                       {s.domain ? (
                           <img src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=64`} alt={s.name} className="w-full h-full object-cover" />
                       ) : (
                           s.name.charAt(0)
                       )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price & Currency */}
          <div className="flex gap-3">
             <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Prix</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-black dark:focus:border-white focus:ring-0 transition-all font-semibold text-lg text-gray-900 dark:text-white placeholder-gray-400"
                />
             </div>
             <div className="w-1/3">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Devise</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full p-4 h-[62px] bg-gray-50 dark:bg-gray-800 rounded-2xl border-r-[16px] border-transparent font-bold text-gray-900 dark:text-white"
                >
                  {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          </div>

          {/* Cycle & Date */}
          <div className="flex gap-3">
            <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cycle</label>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                   {Object.values(BillingCycle).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCycle(c)}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${cycle === c ? 'bg-white dark:bg-gray-700 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}
                      >
                        {c}
                      </button>
                   ))}
                </div>
            </div>
            <div className="flex-1">
               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Début</label>
               <input 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full p-3.5 h-[58px] bg-gray-50 dark:bg-gray-800 rounded-xl font-bold text-sm text-gray-900 dark:text-white"
               />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Couleur & Catégorie</label>
            {/* Reduced size: w-8 h-8 instead of w-10 h-10, reduced gap */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar p-1 -mx-1">
              {BRAND_COLORS.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-8 h-8 rounded-full flex-shrink-0 transition-transform ${color.bg} ${selectedColorIndex === idx ? 'ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600 scale-110' : 'opacity-70 hover:opacity-100'}`}
                >
                  {selectedColorIndex === idx && <Check size={14} className="text-white mx-auto" />}
                </button>
              ))}
            </div>
             {/* Category Selector (Compact Pills) */}
             <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.values(Category).map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${category === cat ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        {CATEGORY_ICONS[cat]} {cat}
                    </button>
                ))}
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-lg font-bold rounded-2xl shadow-lg active:scale-95 transition-transform mt-4"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddModal;