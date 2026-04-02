import { Roommate, Expense, Payment } from '../types';

export const ROOMMATES: Roommate[] = [
  {
    id: "1",
    name: "You",
    initials: "",
    avatar: "",
    balance: 0,
    contributionTotal: 0,
  },
  {
    id: "2",
    name: "Bob V.",
    initials: "BV",
    avatar: "",
    balance: 0,
    contributionTotal: 0,
  },
  {
    id: "3",
    name: "Lauren S.",
    initials: "LS",
    avatar: "",
    balance: 0,
    contributionTotal: 0,
  },
];

export const EXPENSES: Expense[] = [
  {
    id: "e1",
    description: "Grocery run - IGA",
    amount: 18.00,
    date: "2026-04-01",
    category: "Groceries",
    paidBy: "3",
    splitWith: ["1", "2", "3"],
  },
  {
    id: "e2",
    description: "Hydro-Québec",
    amount: 111.00,
    category: "Utilities",
    paidBy: "1", // Adjusted to make Lauren owe You
    date: "2026-03-27",
    splitWith: ["1", "2", "3"],
  },
  {
    id: "e3",
    description: "Grocery run - IGA",
    amount: 47.00,
    date: "2026-03-14",
    category: "Groceries",
    paidBy: "1",
    splitWith: ["1", "2", "3"],
  },
  {
    id: "e4",
    description: "Supplies",
    amount: 14.00,
    date: "2026-03-13",
    category: "Household",
    paidBy: "2",
    splitWith: ["1", "2", "3"],
  },
  {
    id: "e5",
    description: "Supplies",
    amount: 24.42,
    date: "2026-03-13",
    category: "Household",
    paidBy: "2",
    splitWith: ["1", "2", "3"],
  },
  {
    id: "e6",
    description: "Netflix",
    amount: 21.84,
    date: "2026-03-11",
    category: "Other",
    paidBy: "1",
    splitWith: ["1", "2", "3"],
  },
  {
    id: "e7",
    description: "Monthly Rent",
    amount: 2100,
    date: "2026-03-15",
    category: "Rent",
    paidBy: "2", // Adjusted to make You owe Sofia
    splitWith: ["1", "2", "3"],
  },
];

export const PAYMENTS: Payment[] = [];
