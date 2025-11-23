import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RealTimeService {
  private ordersSubject = new Subject<any>();
  orders$ = this.ordersSubject.asObservable();

  connect(): void {
    // TODO: Connexion WebSocket
  }

  disconnect(): void {
    // TODO: Déconnexion
  }
}
