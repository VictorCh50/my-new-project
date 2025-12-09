import api from './api';

export const accountService = {
  // Get account balance
  getBalance: async () => {
    const response = await api.get('/account/balance');
    return response.data;
  },

  // Get account details
  getAccountDetails: async () => {
    const response = await api.get('/account/details');
    return response.data;
  },

  // Get transaction history
  getTransactions: async (page = 1, limit = 10) => {
    const response = await api.get(`/account/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Transfer funds
  transfer: async (transferData) => {
    const response = await api.post('/transactions/transfer', transferData);
    return response.data;
  }
};
