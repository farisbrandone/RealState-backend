import httpClient from '../clients/http.client';

export const authApi = {
  login: (email: string, password: string) => httpClient.post('/auth/login', { email, password }),
  register: (data: any) => httpClient.post('/auth/register', data),
  refresh: (refreshToken: string) => httpClient.post('/auth/refresh', { refreshToken }),
  requestPasswordReset: (email: string) =>
    httpClient.post('/auth/verification/request-password-reset', { email }),
  resetPassword: (token: string, newPassword: string) =>
    httpClient.post('/auth/verification/reset-password', { token, newPassword }),
  verifyEmail: (token: string) => httpClient.post('/auth/verification/verify-email', { token }),
  getMe: () => httpClient.get('/auth/user/me'),
};
