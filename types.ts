export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CHF = 'CHF'
}

export enum BillingCycle {
  MONTHLY = 'Mois',
  YEARLY = 'An'
}

export enum Category {
  ENTERTAINMENT = 'Divertissement',
  UTILITY = 'Utilitaire',
  WORK = 'Travail',
  SOCIAL = 'Social',
  TRANSPORT = 'Transport',
  FOOD = 'Nourriture',
  INSURANCE = 'Assurance',
  OTHER = 'Autre'
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  cycle: BillingCycle;
  category: Category;
  color: string; // Hex code or Tailwind class reference
  firstPaymentDate: string; // ISO Date
  icon?: string;
  logoUrl?: string; // URL de l'image
}

export type ExchangeRates = Record<Currency, number>;