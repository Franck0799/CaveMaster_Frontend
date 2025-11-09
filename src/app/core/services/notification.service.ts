// ==========================================
// FICHIER: src/app/services/notification.service.ts
// VERSION COMPLÈTE ET AMÉLIORÉE
// ==========================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  title?: string;
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<ToastNotification[]>([]);
  public notifications$ = this.notifications.asObservable();
  public notificationsCount$ = this.notifications$.pipe(
    map(items => items.length)
  );

  private readonly DEFAULT_DURATION = 3000;
  private readonly MAX_NOTIFICATIONS = 5;

  show(
    message: string,
    type: NotificationType = 'info',
    duration: number = this.DEFAULT_DURATION,
    options?: Partial<ToastNotification>
  ): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification: ToastNotification = {
      id,
      type,
      message,
      duration,
      dismissible: true,
      ...options
    };

    let current = this.notifications.value;

    // Limiter le nombre de notifications
    if (current.length >= this.MAX_NOTIFICATIONS) {
      current = current.slice(-(this.MAX_NOTIFICATIONS - 1));
    }

    this.notifications.next([...current, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  success(message: string, duration?: number, options?: Partial<ToastNotification>): string {
    return this.show(message, 'success', duration, options);
  }

  error(message: string, duration?: number, options?: Partial<ToastNotification>): string {
    return this.show(message, 'error', duration || 5000, options);
  }

  info(message: string, duration?: number, options?: Partial<ToastNotification>): string {
    return this.show(message, 'info', duration, options);
  }

  warning(message: string, duration?: number, options?: Partial<ToastNotification>): string {
    return this.show(message, 'warning', duration || 4000, options);
  }

  remove(id: string): void {
    const current = this.notifications.value.filter(n => n.id !== id);
    this.notifications.next(current);
  }

  clear(): void {
    this.notifications.next([]);
  }

  // Notifications avec actions
  showWithAction(
    message: string,
    type: NotificationType,
    actionLabel: string,
    actionCallback: () => void,
    duration?: number
  ): string {
    return this.show(message, type, duration, {
      action: {
        label: actionLabel,
        callback: actionCallback
      }
    });
  }

  // Notification de confirmation
  confirmAction(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    this.showWithAction(
      message,
      'warning',
      'Confirmer',
      () => {
        onConfirm();
      },
      0 // Ne pas auto-dismiss
    );
  }
}
