// ==========================================
// SOLUTION 1 : Avec constructor (Recommandé)
// ==========================================

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let notification of notifications$ | async"
        class="toast animate-slide-in"
        [ngClass]="'toast-' + notification.type">

        <div class="toast-icon">
          <span *ngIf="notification.type === 'success'">✓</span>
          <span *ngIf="notification.type === 'error'">✕</span>
          <span *ngIf="notification.type === 'info'">ℹ</span>
          <span *ngIf="notification.type === 'warning'">⚠</span>
        </div>

        <div class="toast-content">
          <h4 class="toast-title" *ngIf="notification.title">{{ notification.title }}</h4>
          <span class="toast-message">{{ notification.message }}</span>

          <button
            *ngIf="notification.action"
            class="toast-action"
            (click)="handleAction(notification)">
            {{ notification.action.label }}
          </button>
        </div>

        <button
          *ngIf="notification.dismissible !== false"
          class="toast-close"
          (click)="notificationService.remove(notification.id)"
          aria-label="Fermer">
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      pointer-events: none;
    }

    .toast {
      pointer-events: all;
      background: var(--card-bg);
      border-radius: 0.75rem;
      padding: 1rem 1.25rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      border-left: 4px solid;
      min-width: 320px;
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(120%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success { border-left-color: #10b981; }
    .toast-error { border-left-color: #ef4444; }
    .toast-info { border-left-color: #3b82f6; }
    .toast-warning { border-left-color: #f59e0b; }

    .toast-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .toast-success .toast-icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .toast-error .toast-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .toast-info .toast-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .toast-warning .toast-icon {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .toast-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }

    .toast-message {
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.4;
    }

    .toast-action {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary);
      border: none;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
      align-self: flex-start;
      transition: all 0.2s ease;
    }

    .toast-action:hover {
      background: rgba(99, 102, 241, 0.2);
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .toast-close:hover {
      background: var(--card-hover);
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .toast-container {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }

      .toast {
        min-width: auto;
      }
    }
  `]
})
export class ToastNotificationComponent {
  // ✅ SOLUTION 2: Utiliser inject() - Angular moderne
  notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  handleAction(notification: any): void {
    if (notification.action?.callback) {
      notification.action.callback();
      this.notificationService.remove(notification.id);
    }
  }
}
