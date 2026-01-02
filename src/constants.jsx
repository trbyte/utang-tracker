
import { TransactionStatus } from './types';

export const INITIAL_TRANSACTIONS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+63 912 345 6789',
    amount: 5000,
    dateBorrowed: '2023-10-15 14:30',
    status: TransactionStatus.COMPLETED,
    datePaid: '2023-11-01 09:15',
    notes: 'Borrowed for rent assistance.',
    avatar: 'https://picsum.photos/seed/john/200'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+63 998 765 4321',
    amount: 2500,
    dateBorrowed: '2023-11-20 10:00',
    status: TransactionStatus.PENDING,
    notes: 'Emergency medical funds.',
    avatar: 'https://picsum.photos/seed/jane/200'
  },
  {
    id: '3',
    name: 'Mike Ross',
    email: 'mike.ross@legal.com',
    phone: '+63 945 111 2222',
    amount: 15000,
    dateBorrowed: '2023-09-05 16:45',
    status: TransactionStatus.OVERDUE,
    notes: 'Legal processing fees.',
    avatar: 'https://picsum.photos/seed/mike/200'
  },
  {
    id: '4',
    name: 'Rachel Zane',
    email: 'rachel@design.co',
    phone: '+63 917 888 9999',
    amount: 1200,
    dateBorrowed: '2023-12-01 11:20',
    status: TransactionStatus.PENDING,
    notes: 'Quick lunch treat, to be paid next week.',
    avatar: 'https://picsum.photos/seed/rachel/200'
  }
];

export const APP_COLORS = {
  primary: '#ffffff',
  secondary: '#da9595',
  accent: '#ce2727',
};
