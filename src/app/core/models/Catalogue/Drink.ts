/**
 * Modèle unique du catalogue, aligné sur l'entité backend
 * CaveMaster1_Backend.Domain.Entities.Catalogue.Drink.
 *
 * Cette entité fusionne les anciennes interfaces locales "Drink", "Wine",
 * "WineProduct" et une partie de "StockItem" qui existaient séparément dans
 * plusieurs pages du frontend : c'est désormais la seule source de vérité
 * pour un produit du catalogue.
 */
export interface Drink {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  category: string;
  format?: string;
  packagingType?: string;
  supplierId?: string;
  depot?: string;
  commercialName?: string;
  commercialContact?: string;
  bulkUnit?: string;
  bulkQuantity: number;
  unitsPerBulk: number;
  purchasePrice: number;
  sellingPrice: number;
  description?: string;

  region?: string;
  vintage?: string;
  grapeVariety?: string;
  alcoholPercentage?: number;
  volumeMl?: number;
  serviceTemperature?: string;
  pairings: string[];
  rating: number;

  isFeatured: boolean;
  isPopular: boolean;
  badge?: 'hot' | 'new';
  salesCount: number;

  createdAt?: string;
  updatedAt?: string;
}
