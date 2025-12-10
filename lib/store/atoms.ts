import { atom } from 'jotai';

// Selected sale for payment operations
export const selectedSaleAtom = atom<string | null>(null);

// Modal state
export const modalStateAtom = atom<{
  isOpen: boolean;
  type: 'purchase' | 'sale' | 'payment' | null;
  data?: Record<string, unknown>;
}>({
  isOpen: false,
  type: null,
});

// Theme mode
export const themeModeAtom = atom<'light' | 'dark'>('light');

// Sidebar menu active item
export const sidebarMenuAtom = atom<string>('/dashboard');

// Purchase form state
export const purchaseFormAtom = atom<{
  supplier: string;
  date: string;
  quantity: number | string;
  rate: number | string;
  amount: number | string;
}>({
  supplier: '',
  date: new Date().toISOString().split('T')[0],
  quantity: '',
  rate: '',
  amount: '',
});

// Sale form state
export const saleFormAtom = atom<{
  customer: string;
  date: string;
  quantity: number | string;
  rate: number | string;
  amount: number | string;
  paymentReceived: number | string;
}>({
  customer: '',
  date: new Date().toISOString().split('T')[0],
  quantity: '',
  rate: '',
  amount: '',
  paymentReceived: '',
});

// Payment form state
export const paymentFormAtom = atom<{
  saleId: string;
  date: string;
  amount: number | string;
}>({
  saleId: '',
  date: new Date().toISOString().split('T')[0],
  amount: '',
});

// Loading state
export const loadingAtom = atom<boolean>(false);

// Error message
export const errorMessageAtom = atom<string | null>(null);

// Success message
export const successMessageAtom = atom<string | null>(null);
