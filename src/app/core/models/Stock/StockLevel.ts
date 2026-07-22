/** Aligné sur CaveMaster1_Backend.Domain.Entities.Stock.StockLevel */
export interface ApiStockLevel {
  id: string;
  drinkId: string;
  caveId: string;
  currentQuantity: number;
  minThreshold: number;
  maxThreshold: number;
  lastEntryDate?: string;
  lastExitDate?: string;
  lastInventoryDate?: string;
}
