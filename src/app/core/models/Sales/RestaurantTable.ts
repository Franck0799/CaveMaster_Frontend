/** Aligné sur CaveMaster1_Backend.Domain.Entities.Sales.RestaurantTable */
export interface ApiRestaurantTable {
  id: string;
  caveId: string;
  number: string;
  seats: number;
  status: 'free' | 'occupied' | 'reserved' | 'billing';
  serverId?: string;
  occupiedSince?: string;
  currentAmount: number;
  guestsCount?: number;
  x: number;
  y: number;
}
