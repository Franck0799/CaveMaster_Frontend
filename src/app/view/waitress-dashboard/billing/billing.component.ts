// ==========================================
// FICHIER: src/app/server/billing/billing.component.ts
// DESCRIPTION: Génération d'addition et encaissement
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface BillItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface DiscountOption {
  id: string;
  label: string;
  type: 'percentage' | 'fixed';
  value: number;
}

@Component({
  selector: 'app-billing',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule,RouterModule, ReactiveFormsModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  tableNumber?: string;
  orderId?: number;

  // ✅ PROPRIÉTÉ AJOUTÉE : Date actuelle
  currentDate = new Date();

  billItems: BillItem[] = [
    { id: 1, name: 'Magret de Canard', quantity: 1, unitPrice: 24.00, totalPrice: 24.00, category: 'Plat' },
    { id: 2, name: 'Pavé de Saumon', quantity: 1, unitPrice: 22.00, totalPrice: 22.00, category: 'Plat' },
    { id: 3, name: 'Château Margaux 2015', quantity: 1, unitPrice: 85.00, totalPrice: 85.00, category: 'Vin' },
    { id: 4, name: 'Eau Minérale', quantity: 2, unitPrice: 4.00, totalPrice: 8.00, category: 'Boisson' },
    { id: 5, name: 'Tiramisu', quantity: 2, unitPrice: 8.50, totalPrice: 17.00, category: 'Dessert' }
  ];

  paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'Espèces', icon: 'dollar-sign' },
    { id: 'card', name: 'Carte Bancaire', icon: 'credit-card' },
    { id: 'mobile', name: 'Paiement Mobile', icon: 'smartphone' },
    { id: 'check', name: 'Chèque', icon: 'file-text' },
    { id: 'voucher', name: 'Chèque Restaurant', icon: 'gift' }
  ];

  discountOptions: DiscountOption[] = [
    { id: 'none', label: 'Aucune', type: 'percentage', value: 0 },
    { id: '10p', label: '10%', type: 'percentage', value: 10 },
    { id: '20p', label: '20%', type: 'percentage', value: 20 },
    { id: '5e', label: '5 €', type: 'fixed', value: 5 },
    { id: '10e', label: '10 €', type: 'fixed', value: 10 },
    { id: 'custom', label: 'Personnalisé', type: 'percentage', value: 0 }
  ];

  selectedPaymentMethod = 'card';
  selectedDiscount = 'none';
  customDiscountValue = 0;
  tipAmount = 0;
  splitCount = 1;

  showPrintPreview = false;
  showPaymentModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tableNumber = params['tableNumber'];
      this.orderId = params['orderId'];
    });
  }

   // ✅ MÉTHODE AJOUTÉE : Obtenir le nom de la méthode de paiement sélectionnée
  getSelectedPaymentMethodName(): string {
    if (!this.selectedPaymentMethod) {
      return 'Aucune';
    }
    const method = this.paymentMethods.find(pm => pm.id === this.selectedPaymentMethod);
    return method ? method.name : 'Aucune';
  }

  // ✅ MÉTHODE AJOUTÉE : Obtenir l'icône de la méthode de paiement sélectionnée
  getSelectedPaymentMethodIcon(): string {
    if (!this.selectedPaymentMethod) {
      return '❓';
    }
    const method = this.paymentMethods.find(pm => pm.id === this.selectedPaymentMethod);
    return method ? method.icon : '❓';
  }

  getSubtotal(): number {
    return this.billItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getDiscountAmount(): number {
    const subtotal = this.getSubtotal();
    const discount = this.discountOptions.find(d => d.id === this.selectedDiscount);

    if (!discount || discount.id === 'none') return 0;

    if (discount.id === 'custom') {
      return discount.type === 'percentage'
        ? (subtotal * this.customDiscountValue / 100)
        : this.customDiscountValue;
    }

    return discount.type === 'percentage'
      ? (subtotal * discount.value / 100)
      : discount.value;
  }

  getTotalAfterDiscount(): number {
    return this.getSubtotal() - this.getDiscountAmount();
  }

  getTotalWithTip(): number {
    return this.getTotalAfterDiscount() + this.tipAmount;
  }

  getAmountPerPerson(): number {
    return this.getTotalWithTip() / this.splitCount;
  }

  addTip(amount: number): void {
    this.tipAmount = amount;
  }

  calculateTipPercentage(percentage: number): void {
    this.tipAmount = this.getTotalAfterDiscount() * (percentage / 100);
  }

  incrementSplit(): void {
    if (this.splitCount < 20) {
      this.splitCount++;
    }
  }

  decrementSplit(): void {
    if (this.splitCount > 1) {
      this.splitCount--;
    }
  }

  removeItem(index: number): void {
    if (confirm('Retirer cet article de l\'addition ?')) {
      this.billItems.splice(index, 1);
    }
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      const item = this.billItems[index];
      item.quantity = newQuantity;
      item.totalPrice = item.unitPrice * newQuantity;
    }
  }

  openPrintPreview(): void {
    this.showPrintPreview = true;
  }

  closePrintPreview(): void {
    this.showPrintPreview = false;
  }

  printBill(): void {
    window.print();
  }

  openPaymentModal(): void {
    if (this.billItems.length === 0) {
      alert('L\'addition est vide');
      return;
    }
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  processPayment(): void {
    const paymentMethod = this.paymentMethods.find(pm => pm.id === this.selectedPaymentMethod);

    const paymentData = {
      tableNumber: this.tableNumber,
      orderId: this.orderId,
      items: this.billItems,
      subtotal: this.getSubtotal(),
      discount: this.getDiscountAmount(),
      tip: this.tipAmount,
      total: this.getTotalWithTip(),
      paymentMethod: paymentMethod?.name,
      splitCount: this.splitCount,
      amountPerPerson: this.getAmountPerPerson(),
      timestamp: new Date()
    };

    // TODO: Envoyer au backend
    console.log('Payment processed:', paymentData);

    alert(`Paiement de ${this.getTotalWithTip().toFixed(2)} € enregistré avec succès !`);

    this.closePaymentModal();
    this.router.navigate(['/server/home']);
  }

  sendByEmail(): void {
    const email = prompt('Adresse email du client:');
    if (email) {
      // TODO: Envoyer l'addition par email
      console.log('Sending bill to:', email);
      alert(`Addition envoyée à ${email}`);
    }
  }

  cancelBill(): void {
    if (confirm('Annuler cette addition ?')) {
      this.router.navigate(['/server/tables']);
    }
  }
}

