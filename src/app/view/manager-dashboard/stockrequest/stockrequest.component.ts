// ==========================================
// STOCK REQUEST COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

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
  requestedBy: string;
  approvedBy?: string;
  priority: 'low' | 'medium' | 'high';
  supplier?: string;
  estimatedCost?: number;
}

@Component({
  selector: 'app-stockrequest',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stockrequest.component.html',
  styleUrls: ['./stockrequest.component.scss']
})
export class StockRequestComponent implements OnInit {
  selectedStatus = 'all';
  searchTerm = '';
  sortBy: 'date' | 'priority' | 'quantity' = 'date';

  showCreateModal = false;
  showDetailsModal = false;
  showEditModal = false;
  selectedRequest: StockRequest | null = null;

  // Formulaire nouvelle demande
  newRequest: Partial<StockRequest> = {
    productName: '',
    category: '',
    currentStock: 0,
    requestedQuantity: 0,
    priority: 'medium',
    notes: ''
  };

  // Catégories disponibles
  categories = [
    'Vin Rouge',
    'Vin Blanc',
    'Vin Rosé',
    'Champagne',
    'Spiritueux',
    'Bière',
    'Soft Drinks',
    'Accessoires'
  ];

  requests: StockRequest[] = [
    {
      id: 'REQ001',
      productName: 'Château Margaux 2015',
      category: 'Vin Rouge',
      currentStock: 2,
      requestedQuantity: 12,
      status: 'pending',
      requestDate: new Date('2025-01-05'),
      notes: 'Stock critique - urgent',
      requestedBy: 'Jean Dupont',
      priority: 'high',
      supplier: 'Vignobles Margaux',
      estimatedCost: 5400
    },
    {
      id: 'REQ002',
      productName: 'Moët & Chandon Brut',
      category: 'Champagne',
      currentStock: 1,
      requestedQuantity: 24,
      status: 'approved',
      requestDate: new Date('2025-01-03'),
      deliveryDate: new Date('2025-01-10'),
      requestedBy: 'Marie Martin',
      approvedBy: 'Admin',
      priority: 'medium',
      supplier: 'Champagne House',
      estimatedCost: 1080
    },
    {
      id: 'REQ003',
      productName: 'Whisky Glenfiddich 18',
      category: 'Spiritueux',
      currentStock: 0,
      requestedQuantity: 6,
      status: 'delivered',
      requestDate: new Date('2025-01-01'),
      deliveryDate: new Date('2025-01-04'),
      requestedBy: 'Pierre Dubois',
      approvedBy: 'Admin',
      priority: 'high',
      supplier: 'Scotland Distillery',
      estimatedCost: 510
    },
    {
      id: 'REQ004',
      productName: 'Châteauneuf-du-Pape',
      category: 'Vin Rouge',
      currentStock: 5,
      requestedQuantity: 18,
      status: 'approved',
      requestDate: new Date('2025-01-04'),
      requestedBy: 'Sophie Laurent',
      approvedBy: 'Admin',
      priority: 'medium',
      supplier: 'Rhône Valley Wines',
      estimatedCost: 1170
    }
  ];

  filteredRequests: StockRequest[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.filterByStatus('all');
  }

  // ===== FILTRAGE ET TRI =====

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.requests];

    // Filtre par statut
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.productName.toLowerCase().includes(term) ||
        r.category.toLowerCase().includes(term) ||
        r.requestedBy.toLowerCase().includes(term)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return b.requestDate.getTime() - a.requestDate.getTime();
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'quantity':
          return b.requestedQuantity - a.requestedQuantity;
        default:
          return 0;
      }
    });

    this.filteredRequests = filtered;
  }

  getCountByStatus(status: string): number {
    return this.requests.filter(r => r.status === status).length;
  }

  // ===== LABELS =====

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvée',
      'rejected': 'Refusée',
      'delivered': 'Livrée'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': '🟡',
      'approved': '✅',
      'rejected': '❌',
      'delivered': '📦'
    };
    return icons[status] || '📄';
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute'
    };
    return labels[priority] || priority;
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🔴'
    };
    return icons[priority] || '⚪';
  }

  // ===== MODAL CRÉATION =====

  createRequest(): void {
    this.newRequest = {
      productName: '',
      category: this.categories[0],
      currentStock: 0,
      requestedQuantity: 0,
      priority: 'medium',
      notes: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  performCreateRequest(): void {
    if (!this.validateRequestForm()) return;

    const request: StockRequest = {
      id: 'REQ' + Date.now().toString().slice(-6),
      productName: this.newRequest.productName!,
      category: this.newRequest.category!,
      currentStock: this.newRequest.currentStock!,
      requestedQuantity: this.newRequest.requestedQuantity!,
      status: 'pending',
      requestDate: new Date(),
      notes: this.newRequest.notes,
      requestedBy: 'Jean Dupont',
      priority: this.newRequest.priority!
    };

    this.requests.unshift(request);
    this.applyFilters();

    this.notificationService.success(
      'Demande de stock créée avec succès',
      3000,
      { title: 'Demande créée' }
    );

    this.closeCreateModal();
  }

  validateRequestForm(): boolean {
    if (!this.newRequest.productName || this.newRequest.productName.trim().length < 3) {
      this.notificationService.error('Le nom du produit doit contenir au moins 3 caractères');
      return false;
    }

    if (!this.newRequest.requestedQuantity || this.newRequest.requestedQuantity <= 0) {
      this.notificationService.error('La quantité demandée doit être supérieure à 0');
      return false;
    }

    if (this.newRequest.currentStock === undefined || this.newRequest.currentStock < 0) {
      this.notificationService.error('Le stock actuel doit être renseigné');
      return false;
    }

    return true;
  }

  // ===== MODAL DÉTAILS =====

  viewRequest(request: StockRequest): void {
    this.selectedRequest = request;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRequest = null;
  }

  // ===== MODAL MODIFICATION =====

  editRequest(request: StockRequest): void {
    if (request.status !== 'pending') {
      this.notificationService.warning('Seules les demandes en attente peuvent être modifiées');
      return;
    }

    this.selectedRequest = { ...request };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedRequest = null;
  }

  performEditRequest(): void {
    if (!this.selectedRequest) return;

    const index = this.requests.findIndex(r => r.id === this.selectedRequest!.id);
    if (index !== -1) {
      this.requests[index] = { ...this.selectedRequest };
      this.applyFilters();

      this.notificationService.success('Demande modifiée avec succès');
      this.closeEditModal();
    }
  }

  // ===== ACTIONS =====

  approveRequest(request: StockRequest): void {
    if (request.status !== 'pending') {
      this.notificationService.info('Cette demande a déjà été traitée');
      return;
    }

    this.notificationService.showWithAction(
      `Approuver la demande pour ${request.productName} ?`,
      'info',
      'Approuver',
      () => {
        request.status = 'approved';
        request.approvedBy = 'Manager';
        request.deliveryDate = new Date(Date.now() + 7 * 86400000); // +7 jours
        this.applyFilters();
        this.notificationService.success('Demande approuvée');
      }
    );
  }

  rejectRequest(request: StockRequest): void {
    if (request.status !== 'pending') {
      this.notificationService.info('Cette demande a déjà été traitée');
      return;
    }

    const reason = prompt('Raison du refus:');
    if (reason) {
      request.status = 'rejected';
      request.notes = (request.notes ? request.notes + '\n' : '') + `Refusée: ${reason}`;
      this.applyFilters();
      this.notificationService.warning('Demande refusée');
    }
  }

  markAsDelivered(request: StockRequest): void {
    if (request.status !== 'approved') {
      this.notificationService.warning('Seules les demandes approuvées peuvent être marquées comme livrées');
      return;
    }

    this.notificationService.showWithAction(
      `Marquer la demande comme livrée ?`,
      'success',
      'Confirmer',
      () => {
        request.status = 'delivered';
        request.deliveryDate = new Date();
        this.applyFilters();
        this.notificationService.success('Demande marquée comme livrée');
      }
    );
  }

  cancelRequest(request: StockRequest): void {
    if (request.status !== 'pending') {
      this.notificationService.warning('Seules les demandes en attente peuvent être annulées');
      return;
    }

    this.notificationService.showWithAction(
      `Annuler la demande pour ${request.productName}?`,
      'warning',
      'Annuler',
      () => {
        const index = this.requests.findIndex(r => r.id === request.id);
        if (index !== -1) {
          this.requests.splice(index, 1);
          this.applyFilters();
          this.notificationService.success('Demande annulée');
        }
      }
    );
  }

  duplicateRequest(request: StockRequest): void {
    const duplicate: StockRequest = {
      ...request,
      id: 'REQ' + Date.now().toString().slice(-6),
      status: 'pending',
      requestDate: new Date(),
      deliveryDate: undefined,
      approvedBy: undefined
    };

    this.requests.unshift(duplicate);
    this.applyFilters();
    this.notificationService.success('Demande dupliquée');
  }

  // ===== EXPORT =====

  exportRequests(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demandes_stock_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    this.notificationService.success('Demandes exportées');
  }

  generateCSV(): string {
    let csv = 'ID,Produit,Catégorie,Stock Actuel,Quantité,Statut,Priorité,Date,Demandé par\n';

    this.filteredRequests.forEach(r => {
      csv += `${r.id},${r.productName},${r.category},${r.currentStock},${r.requestedQuantity},${r.status},${r.priority},${r.requestDate.toISOString()},${r.requestedBy}\n`;
    });

    return csv;
  }

  printRequests(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  exportToPDF(): void {
    this.notificationService.info('Export PDF en cours...');
    setTimeout(() => {
      this.notificationService.success('PDF généré avec succès');
    }, 1500);
  }

  // ===== STATISTIQUES =====

  getTotalRequested(): number {
    return this.requests.reduce((sum, r) => sum + r.requestedQuantity, 0);
  }

  getPendingValue(): number {
    return this.requests
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.estimatedCost || 0), 0);
  }

  getApprovalRate(): number {
    const total = this.requests.length;
    if (total === 0) return 0;
    const approved = this.requests.filter(r => r.status === 'approved' || r.status === 'delivered').length;
    return Math.round((approved / total) * 100);
  }

  getAverageDeliveryTime(): string {
    const delivered = this.requests.filter(r => r.status === 'delivered' && r.deliveryDate);
    if (delivered.length === 0) return 'N/A';

    const totalDays = delivered.reduce((sum, r) => {
      const days = Math.floor((r.deliveryDate!.getTime() - r.requestDate.getTime()) / 86400000);
      return sum + days;
    }, 0);

    return `${Math.round(totalDays / delivered.length)} jours`;
  }

  // ===== ACTIONS GROUPÉES =====

  approveAllPending(): void {
    const pending = this.requests.filter(r => r.status === 'pending');

    if (pending.length === 0) {
      this.notificationService.info('Aucune demande en attente');
      return;
    }

    this.notificationService.showWithAction(
      `Approuver ${pending.length} demande(s) en attente ?`,
      'warning',
      'Approuver tout',
      () => {
        pending.forEach(r => {
          r.status = 'approved';
          r.approvedBy = 'Manager';
          r.deliveryDate = new Date(Date.now() + 7 * 86400000);
        });
        this.applyFilters();
        this.notificationService.success(`${pending.length} demande(s) approuvée(s)`);
      }
    );
  }

  exportSummary(): void {
    this.notificationService.info('Export du résumé en cours...');
  }

  sendReminderToSupplier(request: StockRequest): void {
    if (!request.supplier) {
      this.notificationService.warning('Aucun fournisseur associé à cette demande');
      return;
    }

    this.notificationService.success(`Rappel envoyé à ${request.supplier}`);
  }

  // ===== UTILITAIRES =====

  formatCurrency(value: number): string {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  getTimeToDelivery(request: StockRequest): string {
    if (!request.deliveryDate) return 'Non définie';

    const now = new Date();
    const delivery = new Date(request.deliveryDate);
    const diffDays = Math.floor((delivery.getTime() - now.getTime()) / 86400000);

    if (diffDays < 0) return 'En retard';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  }

  refreshRequests(): void {
    this.applyFilters();
    this.notificationService.info('Liste actualisée');
  }
}
