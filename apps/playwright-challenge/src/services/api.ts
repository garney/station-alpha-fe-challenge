import { Transaction, TransactionStatus } from "../types/transaction";
import { User } from "../types/user";

// Using JSONPlaceholder as a public dummy API
const API_URL = "https://jsonplaceholder.typicode.com/users";

// Random status generator for demonstration
const getRandomStatus = (): TransactionStatus => {
  const statuses: TransactionStatus[] = ["initiated", "processed", "canceled"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Random date within the last 30 days
const getRandomDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  now.setDate(now.getDate() - daysAgo);
  return now.toISOString();
};

// Random amount between 100 and 5000
const getRandomAmount = (): number => {
  return Math.floor(Math.random() * 4900) + 100;
};

// Random currency
const getRandomCurrency = (): string => {
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];
  return currencies[Math.floor(Math.random() * currencies.length)];
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Transform the user data into transaction data
    const users = await response.json();

    // Map the users to transactions
    const transactions: Transaction[] = users.map((user: any) => ({
      id: user.id.toString(),
      date: getRandomDate(),
      amount: getRandomAmount(),
      currency: getRandomCurrency(),
      description: `Payment to ${user.name}`,
      beneficiary: user.name,
      accountNumber: `ACCT${user.id}${Math.floor(Math.random() * 10000000)}`,
      status: getRandomStatus(),
      reference: `REF${Math.floor(Math.random() * 1000000)}`,
    }));

    return transactions;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Get users from API
    const users = await response.json();

    // Add some null company values for testing (for users with even IDs)
    const processedUsers = users.map((user: User) => ({
      ...user,
      company: user.id % 2 === 0 ? null : user.company,
    }));

    return processedUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};
