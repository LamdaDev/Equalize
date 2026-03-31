export type Category = 'Groceries' | 'Utilities' | 'Household' | 'Rent' | 'Other';

export interface Roommate {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  balance: number; // Positive means they are owed, negative means they owe
  contributionTotal: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  paidBy: string; // Roommate ID
  splitWith: string[]; // Array of Roommate IDs
  note?: string;
}

export interface Payment {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  method: string;
  note?: string;
}
