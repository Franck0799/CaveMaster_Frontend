import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseData } from '../../models/ApiResponseData';

/**
 * Classe de base générique pour consommer les contrôleurs CRUD standards du
 * backend (ceux qui héritent de CrudControllerBase<T> côté .NET :
 * GET /api/{Entité}, GET /api/{Entité}/{id}, POST, PUT, DELETE).
 *
 * Toutes les réponses du backend sont enveloppées dans un objet
 * ApiResponseData<T> ({ success, message, data }). Cette classe se charge de
 * "déballer" systématiquement le champ `data`, pour que les composants qui
 * utilisent ces services reçoivent directement les données utiles.
 *
 * Utilisation :
 *   @Injectable({ providedIn: 'root' })
 *   export class DrinksService extends CrudApiService<Drink> {
 *     constructor(http: HttpClient) { super(http, 'Drinks'); }
 *   }
 */
export abstract class CrudApiService<T> {
  protected readonly baseUrl: string;

  constructor(protected http: HttpClient, resourcePath: string) {
    this.baseUrl = `${environment.apiUrl}/api/${resourcePath}`;
  }

  getAll(): Observable<T[]> {
    return this.http
      .get<ApiResponseData<T[]>>(this.baseUrl)
      .pipe(map(res => res.data ?? []));
  }

  getById(id: string): Observable<T | null> {
    return this.http
      .get<ApiResponseData<T>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => res.data ?? null));
  }

  create(entity: Partial<T>): Observable<T | null> {
    return this.http
      .post<ApiResponseData<T>>(this.baseUrl, entity)
      .pipe(map(res => res.data ?? null));
  }

  update(id: string, entity: Partial<T>): Observable<T | null> {
    return this.http
      .put<ApiResponseData<T>>(`${this.baseUrl}/${id}`, entity)
      .pipe(map(res => res.data ?? null));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponseData<unknown>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => res.success));
  }
}
