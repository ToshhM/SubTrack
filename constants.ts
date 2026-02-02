import { Category, Currency } from "./types";

export const FREE_TIER_LIMIT = 5; // Limite gratuite pour la démo

export const EXCHANGE_RATES: Record<Currency, number> = {
  [Currency.EUR]: 1,
  [Currency.USD]: 1.08,
  [Currency.GBP]: 0.85,
  [Currency.CHF]: 0.95,
};

// Palette inspirée de l'image (Pastels vifs)
export const BRAND_COLORS = [
  { bg: 'bg-[#FF6B6B]', text: 'text-white', name: 'Coral' },    // 0: Red/Coral
  { bg: 'bg-[#4ECDC4]', text: 'text-white', name: 'Mint' },     // 1: Mint
  { bg: 'bg-[#45B7D1]', text: 'text-white', name: 'Sky' },      // 2: Blue
  { bg: 'bg-[#96CEB4]', text: 'text-white', name: 'Sage' },     // 3: Greenish
  { bg: 'bg-[#FFEEAD]', text: 'text-gray-800', name: 'Cream' }, // 4: Yellow
  { bg: 'bg-[#D4A5A5]', text: 'text-white', name: 'Mauve' },    // 5: Pinkish
  { bg: 'bg-[#9B59B6]', text: 'text-white', name: 'Purple' },   // 6: Purple
  { bg: 'bg-[#34495E]', text: 'text-white', name: 'Dark' },     // 7: Dark Blue/Grey
  { bg: 'bg-[#E67E22]', text: 'text-white', name: 'Carrot' },   // 8: Orange
  { bg: 'bg-[#2ECC71]', text: 'text-white', name: 'Emerald' },  // 9: Bright Green
  { bg: 'bg-[#000000]', text: 'text-white', name: 'Black' },    // 10: Black
];

export const CATEGORY_ICONS: Record<Category, string> = {
  [Category.ENTERTAINMENT]: '🎬',
  [Category.UTILITY]: '💡',
  [Category.WORK]: '💼',
  [Category.SOCIAL]: '💬',
  [Category.TRANSPORT]: '🚗',
  [Category.FOOD]: '🍔',
  [Category.INSURANCE]: '🛡️',
  [Category.OTHER]: '📦',
};

// Services pré-définis pour l'autocomplétion
// On ajoute 'domain' pour l'API de logo
export const POPULAR_SERVICES = [
  { name: 'Netflix', price: 13.49, category: Category.ENTERTAINMENT, colorIndex: 0, domain: 'netflix.com' },
  { name: 'Spotify', price: 10.99, category: Category.ENTERTAINMENT, colorIndex: 9, domain: 'spotify.com' },
  { name: 'YouTube Premium', price: 12.99, category: Category.ENTERTAINMENT, colorIndex: 0, domain: 'youtube.com' },
  { name: 'Amazon Prime', price: 6.99, category: Category.ENTERTAINMENT, colorIndex: 2, domain: 'amazon.com' },
  { name: 'Disney+', price: 8.99, category: Category.ENTERTAINMENT, colorIndex: 7, domain: 'disneyplus.com' },
  { name: 'Apple Music', price: 10.99, category: Category.ENTERTAINMENT, colorIndex: 0, domain: 'music.apple.com' },
  { name: 'Apple One', price: 19.95, category: Category.UTILITY, colorIndex: 10, domain: 'apple.com' },
  { name: 'iCloud+', price: 2.99, category: Category.UTILITY, colorIndex: 2, domain: 'icloud.com' },
  { name: 'ChatGPT Plus', price: 22.00, category: Category.WORK, colorIndex: 1, domain: 'openai.com' },
  { name: 'Canal+', price: 22.99, category: Category.ENTERTAINMENT, colorIndex: 10, domain: 'canalplus.com' },
  { name: 'Adobe Creative Cloud', price: 67.01, category: Category.WORK, colorIndex: 0, domain: 'adobe.com' },
  { name: 'Figma', price: 15.00, category: Category.WORK, colorIndex: 10, domain: 'figma.com' },
  { name: 'Notion', price: 10.00, category: Category.WORK, colorIndex: 7, domain: 'notion.so' },
  { name: 'NordVPN', price: 3.99, category: Category.UTILITY, colorIndex: 2, domain: 'nordvpn.com' },
  { name: 'PlayStation Plus', price: 8.99, category: Category.ENTERTAINMENT, colorIndex: 2, domain: 'playstation.com' },
  { name: 'Xbox Game Pass', price: 14.99, category: Category.ENTERTAINMENT, colorIndex: 9, domain: 'xbox.com' },
  { name: 'Tinder', price: 14.99, category: Category.SOCIAL, colorIndex: 0, domain: 'tinder.com' },
  { name: 'Linkedin Premium', price: 29.99, category: Category.WORK, colorIndex: 2, domain: 'linkedin.com' },
  { name: 'Google One', price: 1.99, category: Category.UTILITY, colorIndex: 2, domain: 'google.com' },
  { name: 'Free Mobile', price: 19.99, category: Category.UTILITY, colorIndex: 0, domain: 'free.fr' },
  { name: 'Navigo', price: 86.40, category: Category.TRANSPORT, colorIndex: 2, domain: 'iledefrance-mobilites.fr' },
  { name: 'Uber One', price: 5.99, category: Category.TRANSPORT, colorIndex: 10, domain: 'uber.com' },
  { name: 'Deliveroo Plus', price: 5.99, category: Category.FOOD, colorIndex: 1, domain: 'deliveroo.fr' },
  { name: 'HelloFresh', price: 60.00, category: Category.FOOD, colorIndex: 9, domain: 'hellofresh.com' },
  { name: 'Alan', price: 55.00, category: Category.INSURANCE, colorIndex: 1, domain: 'alan.com' },
  { name: 'Axa', price: 45.00, category: Category.INSURANCE, colorIndex: 7, domain: 'axa.fr' },
];