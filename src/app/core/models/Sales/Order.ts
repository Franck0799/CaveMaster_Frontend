/** Aligné sur CaveMaster1_Backend.Domain.Entities.Sales.OrderItem */
export interface ApiOrderItem {
  id: string;
  drinkId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  status?: 'pending' | 'preparing' | 'ready' | 'served';
  notes?: string;
  wineRecommendation?: boolean;
}

/** Aligné sur CaveMaster1_Backend.Domain.Entities.Sales.Order */
export interface ApiOrder {
  id: string;
  orderType: 'dine_in' | 'shop';
  caveId?: string;
  tableId?: string;
  tableNumber?: string;
  serverId?: string;
  serverName?: string;
  priority?: 'normal' | 'urgent';
  clientUserId?: string;
  deliveryAddressId?: string;
  paymentMethod?: string;
  items: ApiOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'delivered' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
