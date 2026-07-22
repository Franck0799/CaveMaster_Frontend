export interface StorageCondition {
  temperature: number;
  humidity: number;
}

/** Aligné sur CaveMaster1_Backend.Domain.Entities.Cave.Cave */
export interface ApiCave {
  id: string;
  name: string;
  location: string;
  description?: string;
  capacity: number;
  currentStock: number;
  managersCount: number;
  employeesCount: number;
  productivity: number;
  condition: StorageCondition;
  buildingInfo?: string;
  storageType?: string;
  createdAt?: string;
  updatedAt?: string;
}
