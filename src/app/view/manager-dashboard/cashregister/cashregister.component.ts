// ==========================================
// CASH REGISTER COMPONENT (Caisse)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface CashTransaction {
  id: string;
  type: 'opening' | 'sale' | 'expense' | 'closing';
  amount: number;
  description: string;
  timestamp: Date;
}

@Component({
  selector: 'app-cashregister',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./cashregister.component.html`,
  styleUrls: [`./cashregister.component.scss`]
})
export class CashRegisterComponent implements OnInit {
  currentDate = new Date();
  isOpen = true;
  openTime = '08:00';
  closeTime = '23:00';
  openingAmount = 500;

  transactions: CashTransaction[] = [
    {
      id: '1',
      type: 'opening',
      amount: 500,
      description: 'Ouverture de caisse',
      timestamp: new Date(Date.now() - 8 * 3600000)
    },
    {
      id: '2',
      type: 'sale',
      amount: 125.50,
      description: 'Vente Table T05',
      timestamp: new Date(Date.now() - 7 * 3600000)
    },
    {
      id: '3',
      type: 'sale',
      amount: 89.00,
      description: 'Vente Table T12',
      timestamp: new Date(Date.now() - 6 * 3600000)
    },
    {
      id: '4',
      type: 'expense',
      amount: 45.00,
      description: 'Achat fournitures',
      timestamp: new Date(Date.now() - 5 * 3600000)
    },
    {
      id: '5',
      type: 'sale',
      amount: 156.80,
      description: 'Vente Table T08',
      timestamp: new Date(Date.now() - 4 * 3600000)
    },
    {
      id: '6',
      type: 'expense',
      amount: 25.00,
      description: 'Maintenance équipement',
      timestamp: new Date(Date.now() - 3 * 3600000)
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getCurrentCash(): number {
    let total = this.openingAmount;

    this.transactions.forEach(t => {
      if (t.type === 'sale') {
        total += t.amount;
      } else if (t.type === 'expense') {
        total -= t.amount;
      }
    });

    return total;
  }

  getTotalCashSales(): number {
    return this.transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getDifference(): number {
    return this.getCurrentCash() - this.openingAmount;
  }

  getTransactionIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'opening': '🔓',
      'sale': '💰',
      'expense': '💳',
      'closing': '🔒'
    };
    return icons[type] || '📝';
  }

  toggleCashRegister(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.openTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      console.log('Caisse ouverte à', this.openTime);
    } else {
      this.closeTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      console.log('Caisse fermée à', this.closeTime);
    }
  }

  closeCashRegister(): void {
    if (confirm('Êtes-vous sûr de vouloir clôturer la caisse ?')) {
      this.isOpen = false;
      this.closeTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      this.transactions.push({
        id: Date.now().toString(),
        type: 'closing',
        amount: this.getCurrentCash(),
        description: 'Clôture de caisse',
        timestamp: new Date()
      });

      console.log('Caisse clôturée avec', this.getCurrentCash(), '€');
    }
  }

  addExpense(): void {
    console.log('Ajouter une dépense');
  }

  cashCount(): void {
    console.log('Comptage des espèces');
  }

  viewReport(): void {
    console.log('Voir le rapport détaillé');
  }
}
