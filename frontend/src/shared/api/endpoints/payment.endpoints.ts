import httpClient from '../clients/http.client';

export const paymentApi = {
  getPayments: (params?: any) => httpClient.get('/payments', { params }),
  getSubscriptions: () => httpClient.get('/subscriptions'),
  createSubscription: (data: any) => httpClient.post('/subscriptions', data),
  cancelSubscription: (id: string, immediate?: boolean) =>
    httpClient.delete(`/subscriptions/${id}`, { params: { immediate } }),
  getInvoices: () => httpClient.get('/invoices'),
  getPaymentMethods: () => httpClient.get('/payment-methods'),
  addPaymentMethod: (data: any) => httpClient.post('/payment-methods', data),
  deletePaymentMethod: (id: string) => httpClient.delete(`/payment-methods/${id}`),
};
