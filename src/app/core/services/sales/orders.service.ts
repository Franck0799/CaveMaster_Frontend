import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseData } from '../../models/ApiResponseData';
import { ApiOrder, ApiOrderItem } from '../../models/Sales/Order';

/**
 * Consomme /api/Orders (voir OrdersController côté backend). Ne suit pas le
 * pattern CrudApiService générique : filtres par query params, et deux
 * routes PUT dédiées (/items et /status) au lieu d'un PUT générique.
 */
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private baseUrl = `${environment.apiUrl}/api/Orders`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { status?: string; caveId?: string; orderType?: string; clientUserId?: string }): Observable<ApiOrder[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.caveId) params.set('caveId', filters.caveId);
    if (filters?.orderType) params.set('orderType', filters.orderType);
    if (filters?.clientUserId) params.set('clientUserId', filters.clientUserId);
    const qs = params.toString();
    return this.http
      .get<ApiResponseData<ApiOrder[]>>(qs ? `${this.baseUrl}?${qs}` : this.baseUrl)
      .pipe(map(res => res.data ?? []));
  }

  getById(id: string): Observable<ApiOrder | null> {
    return this.http.get<ApiResponseData<ApiOrder>>(`${this.baseUrl}/${id}`).pipe(map(res => res.data ?? null));
  }

  create(order: Partial<ApiOrder>): Observable<ApiOrder | null> {
    return this.http.post<ApiResponseData<ApiOrder>>(this.baseUrl, order).pipe(map(res => res.data ?? null));
  }

  updateItems(id: string, items: ApiOrderItem[]): Observable<ApiOrder | null> {
    return this.http
      .put<ApiResponseData<ApiOrder>>(`${this.baseUrl}/${id}/items`, items)
      .pipe(map(res => res.data ?? null));
  }

  updateStatus(id: string, value: string): Observable<ApiOrder | null> {
    return this.http
      .put<ApiResponseData<ApiOrder>>(`${this.baseUrl}/${id}/status?value=${encodeURIComponent(value)}`, {})
      .pipe(map(res => res.data ?? null));
  }
}
