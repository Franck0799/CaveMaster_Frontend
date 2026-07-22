import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudApiService } from '../api/crud-api.service';
import { Drink } from '../../models/Catalogue/Drink';

/**
 * Consomme /api/Drinks (voir DrinksController côté backend).
 * GET est ouvert à tout utilisateur authentifié ; Create/Update/Delete sont
 * réservés à Admin et Manager (appliqué côté backend, pas la peine de le
 * revérifier ici).
 */
@Injectable({ providedIn: 'root' })
export class DrinksService extends CrudApiService<Drink> {
  constructor(http: HttpClient) {
    super(http, 'Drinks');
  }
}
