import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudApiService } from '../api/crud-api.service';
import { ApiCave } from '../../models/Cave/Cave';

/** Consomme /api/Caves (voir CavesController côté backend). */
@Injectable({ providedIn: 'root' })
export class CavesService extends CrudApiService<ApiCave> {
  constructor(http: HttpClient) {
    super(http, 'Caves');
  }
}
