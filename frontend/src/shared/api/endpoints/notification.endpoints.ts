import { PushSubscriptionRequest } from "@/features/notifications/types";
import httpClient from "../clients/http.client";

export const notificationApi = {
  getUserNotifications: (userId: string, params?: any) =>
    httpClient.get(`/notifications/user/${userId}`, { params }),
  getPreferences: (userId: string) =>
    httpClient.get(`/notifications/users/${userId}/preferences`),
  updatePreferences: (userId: string, data: any) =>
    httpClient.put(`/notifications/users/${userId}/preferences`, data),
  markAsRead: (notificationId: string) =>
    httpClient.put(`/notifications/${notificationId}/read`), // hypothétique, ajuster selon l'API réelle
  retry: (notificationId: string) =>
    httpClient.post(`/notifications/${notificationId}/retry`),
  subscribePush: (data: PushSubscriptionRequest) =>
    httpClient.post(`/notifications/push-subscriptions`, data),
};
