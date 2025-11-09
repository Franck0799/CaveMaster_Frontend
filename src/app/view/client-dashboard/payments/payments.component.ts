// ==========================================
// FICHIER: src/app/client/payments/payments.component.ts
// DESCRIPTION: Page de gestion des paiements
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface PaymentMethod {
  id: number;
  type: 'card' | 'mobile' | 'bank';
  name: string;
  details: string;
  icon: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  method: string;
  orderId: string;
  icon: string;
}

@Component({
  selector: 'app-payments',
  standalone : true,
  imports : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  // Méthodes de paiement
  paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      type: 'card',
      name: 'Visa',
      details: '**** **** **** 4532',
      icon: '💳',
      isDefault: true,
      expiryDate: '12/2026'
    },
    {
      id: 2,
      type: 'mobile',
      name: 'Mobile Money',
      details: '+234 801 234 5678',
      icon: '📱',
      isDefault: false
    },
    {
      id: 3,
      type: 'card',
      name: 'Mastercard',
      details: '**** **** **** 8901',
      icon: '💳',
      isDefault: false,
      expiryDate: '08/2025'
    },
    {
      id: 4,
      type: 'bank',
      name: 'Virement bancaire',
      details: 'IBAN: FR76 ****',
      icon: '🏦',
      isDefault: false
    }
  ];

  // Historique des transactions
  transactions: Transaction[] = [
    {
      id: 'TXN-001',
      date: '2025-11-05',
      amount: 25000,
      status: 'success',
      method: 'Visa **** 4532',
      orderId: '#12457',
      icon: '✅'
    },
    {
      id: 'TXN-002',
      date: '2025-11-03',
      amount: 35000,
      status: 'success',
      method: 'Mobile Money',
      orderId: '#12450',
      icon: '✅'
    },
    {
      id: 'TXN-003',
      date: '2025-10-28',
      amount: 18000,
      status: 'pending',
      method: 'Virement bancaire',
      orderId: '#12455',
      icon: '⏳'
    },
    {
      id: 'TXN-004',
      date: '2025-10-20',
      amount: 30000,
      status: 'success',
      method: 'Visa **** 4532',
      orderId: '#12456',
      icon: '✅'
    },
    {
      id: 'TXN-005',
      date: '2025-10-15',
      amount: 12000,
      status: 'failed',
      method: 'Mastercard **** 8901',
      orderId: '#12448',
      icon: '❌'
    }
  ];

  // Modal
  showAddModal = false;

  constructor() {}

  ngOnInit(): void {
    // Initialisation
  }

  // Définir comme méthode par défaut
  setAsDefault(method: PaymentMethod): void {
    this.paymentMethods.forEach(m => {
      m.isDefault = m.id === method.id;
    });
  }

  // Supprimer une méthode de paiement
  deleteMethod(method: PaymentMethod, event: Event): void {
    event.stopPropagation();
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?`)) {
      this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
    }
  }

  // Modifier une méthode de paiement
  editMethod(method: PaymentMethod, event: Event): void {
    event.stopPropagation();
    console.log('Modifier méthode:', method);
    // Ouvrir modal d'édition
  }

  // Ouvrir modal d'ajout
  openAddModal(): void {
    this.showAddModal = true;
  }

  // Fermer modal d'ajout
  closeAddModal(): void {
    this.showAddModal = false;
  }

  // Obtenir la classe CSS selon le type
  getTypeClass(type: string): string {
    return `method-${type}`;
  }

  // Obtenir la classe CSS selon le statut de transaction
  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Télécharger un reçu
  downloadReceipt(transaction: Transaction, event: Event): void {
    event.stopPropagation();
    console.log('Télécharger reçu:', transaction);
    // Logique de téléchargement
  }
}
