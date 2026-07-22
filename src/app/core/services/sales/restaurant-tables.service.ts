import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudApiService } from '../api/crud-api.service';
import { ApiRestaurantTable } from '../../models/Sales/RestaurantTable';

/** Consomme /api/RestaurantTables (voir StaffControllers.cs côté backend). */
@Injectable({ providedIn: 'root' })
export class RestaurantTablesService extends CrudApiService<ApiRestaurantTable> {
  constructor(http: HttpClient) {
    super(http, 'RestaurantTables');
  }
}
