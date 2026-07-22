import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseData } from '../../models/ApiResponseData';
import { ApiStockLevel } from '../../models/Stock/StockLevel';

/**
 * Consomme /api/StockLevels (voir StockLevelsController côté backend).
 * Lecture seule : les quantités ne changent que via StockEntries/StockExits.
 */
@Injectable({ providedIn: 'root' })
export class StockLevelsService {
  private baseUrl = `${environment.apiUrl}/api/StockLevels`;

  constructor(private http: HttpClient) {}

  getAll(caveId?: string): Observable<ApiStockLevel[]> {
    const url = caveId ? `${this.baseUrl}?caveId=${caveId}` : this.baseUrl;
    return this.http.get<ApiResponseData<ApiStockLevel[]>>(url).pipe(map(res => res.data ?? []));
  }

  getLowStock(caveId?: string): Observable<ApiStockLevel[]> {
    const url = caveId ? `${this.baseUrl}/low-stock?caveId=${caveId}` : `${this.baseUrl}/low-stock`;
    return this.http.get<ApiResponseData<ApiStockLevel[]>>(url).pipe(map(res => res.data ?? []));
  }
}
