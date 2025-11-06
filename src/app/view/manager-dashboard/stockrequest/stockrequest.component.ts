// ==========================================
// STOCK REQUESTS COMPONENT
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


interface StockRequest {
  id: string;
  productName: string;
  category: string;
  currentStock: number;
  requestedQuantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  requestDate: Date;
  deliveryDate?: Date;
  notes?: string;
}

@Component({
  selector: 'app-stockrequest',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./stockrequest.component.html`,
  styleUrls: [`./stockrequest.component.scss`]
})
export class StockRequestComponent implements OnInit {
  selectedStatus = 'all';

  requests: StockRequest[] = [
    {
      id: 'REQ001',
      productName: 'Château Margaux 2015',
      category: 'Vin Rouge',
      currentStock: 2,
      requestedQuantity: 12,
      status: 'pending',
      requestDate: new Date('2025-01-05'),
      notes: 'Stock critique - urgent'
    },
    {
      id: 'REQ002',
      productName: 'Moët & Chandon Brut',
      category: 'Champagne',
      currentStock: 1,
      requestedQuantity: 24,
      status: 'approved',
      requestDate: new Date('2025-01-03'),
      deliveryDate: new Date('2025-01-10')
    },
    {
      id: 'REQ003',
      productName: 'Whisky Glenfiddich 18',
      category: 'Spiritueux',
      currentStock: 0,
      requestedQuantity: 6,
      status: 'delivered',
      requestDate: new Date('2025-01-01'),
      deliveryDate: new Date('2025-01-04')
    }
  ];

  filteredRequests: StockRequest[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filterByStatus('all');
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter(r => r.status === status);
    }
  }

  getCountByStatus(status: string): number {
    return this.requests.filter(r => r.status === status).length;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvée',
      'rejected': 'Refusée',
      'delivered': 'Livrée'
    };
    return labels[status] || status;
  }

  createRequest(): void {
    console.log('Créer une nouvelle demande');
  }

  viewRequest(request: StockRequest): void {
    console.log('Voir demande:', request);
  }

  editRequest(request: StockRequest): void {
    console.log('Modifier demande:', request);
  }

  cancelRequest(request: StockRequest): void {
    if (confirm(`Annuler la demande pour ${request.productName}?`)) {
      console.log('Annuler demande:', request);
    }
  }
}

