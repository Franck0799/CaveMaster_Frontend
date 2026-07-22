import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseData } from '../../models/ApiResponseData';
import { UserDto, CreateUserRequest } from '../../models/Users/UserDto';

/**
 * Consomme /api/Users (voir UsersController côté backend).
 * Ne suit pas le pattern CrudApiService générique car les routes sont un peu
 * différentes (filtre ?role=, pas de PUT générique par id, mais /me et /enable).
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = `${environment.apiUrl}/api/Users`;

  constructor(private http: HttpClient) {}

  /** GET /api/Users?role=... : liste des utilisateurs (Admin/Manager uniquement). */
  getAll(role?: string): Observable<UserDto[]> {
    const url = role ? `${this.baseUrl}?role=${encodeURIComponent(role)}` : this.baseUrl;
    return this.http.get<ApiResponseData<UserDto[]>>(url).pipe(map(res => res.data ?? []));
  }

  getById(id: string): Observable<UserDto | null> {
    return this.http.get<ApiResponseData<UserDto>>(`${this.baseUrl}/${id}`).pipe(map(res => res.data ?? null));
  }

  /** POST /api/Users : création d'un compte (Admin uniquement). */
  create(request: CreateUserRequest): Observable<ApiResponseData<unknown>> {
    return this.http.post<ApiResponseData<unknown>>(this.baseUrl, request);
  }

  /** PUT /api/Users/{id}/enable?isEnabled= : active/désactive un compte (Admin uniquement). */
  setEnabled(id: string, isEnabled: boolean): Observable<boolean> {
    return this.http
      .put<ApiResponseData<unknown>>(`${this.baseUrl}/${id}/enable?isEnabled=${isEnabled}`, {})
      .pipe(map(res => res.success));
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<ApiResponseData<unknown>>(`${this.baseUrl}/${id}`).pipe(map(res => res.success));
  }
}
