import { Roommate, Expense, Payment } from '../types';

export const ROOMMATES: Roommate[] = [
  { id: '1', name: 'You', initials: 'CC', avatar: '', balance: -6.00, contributionTotal: 370.00 },
  { id: '2', name: 'Sofia C.', initials: 'SC', avatar: '', balance: 90.50, contributionTotal: 188.00 },
  { id: '3', name: 'Lauren S.', initials: 'LS', avatar: '', balance: -84.50, contributionTotal: 139.58 },
];

export const EXPENSES: Expense[] = [
  {
    id: 'e1',
    description: 'Grocery run - IGA',
    amount: 18.00,
    date: '2026-04-01',
    category: 'Groceries',
    paidBy: '3',
    splitWith: ['1', '2', '3'],
  },
  {
    id: 'e2',
    description: 'Hydro-Québec',
    amount: 111.00,
    date: '2026-03-27',
    category: 'Utilities',
    paidBy: '3',
    splitWith: ['1', '2', '3'],
  },
  {
    id: 'e3',
    description: 'Grocery run - IGA',
    amount: 47.00,
    date: '2026-03-14',
    category: 'Groceries',
    paidBy: '1',
    splitWith: ['1', '2', '3'],
  },
  {
    id: 'e4',
    description: 'Supplies',
    amount: 14.00,
    date: '2026-03-13',
    category: 'Household',
    paidBy: '2',
    splitWith: ['1', '2', '3'],
  },
  {
    id: 'e5',
    description: 'Supplies',
    amount: 24.42,
    date: '2026-03-13',
    category: 'Household',
    paidBy: '2',
    splitWith: ['1', '2', '3'],
  },
];

export const PAYMENTS: Payment[] = [];
