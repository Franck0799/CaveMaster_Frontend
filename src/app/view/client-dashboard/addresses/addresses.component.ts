// ==========================================
// FICHIER: src/app/client/addresses/addresses.component.ts
// DESCRIPTION: Page de gestion des adresses
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Address {
  id: number;
  type: 'Domicile' | 'Bureau' | 'Autre';
  name: string;
  street: string;
  complement?: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
  icon: string;
}

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  addresses: Address[] = [
    {
      id: 1,
      type: 'Domicile',
      name: 'Marie Dupont',
      street: '45 Avenue des Champs',
      complement: 'Lekki Phase 1',
      city: 'Lagos, Nigeria',
      country: 'Nigeria',
      phone: '+234 801 234 5678',
      isDefault: true,
      icon: '🏠'
    },
    {
      id: 2,
      type: 'Bureau',
      name: 'Marie Dupont',
      street: 'DrinkStore HQ',
      complement: 'Victoria Island',
      city: 'Lagos, Nigeria',
      country: 'Nigeria',
      phone: '+234 809 876 5432',
      isDefault: false,
      icon: '🏢'
    },
    {
      id: 3,
      type: 'Autre',
      name: 'Jean Martin',
      street: '78 Banana Island',
      complement: 'Ikoyi',
      city: 'Lagos, Nigeria',
      country: 'Nigeria',
      phone: '+234 812 345 6789',
      isDefault: false,
      icon: '📍'
    }
  ];

  showAddModal = false;
  showEditModal = false;
  selectedAddress: Address | null = null;

  constructor() {}

  ngOnInit(): void {
    // Initialisation
  }

  // Ouvrir le modal d'ajout
  openAddModal(): void {
    this.showAddModal = true;
  }

  // Fermer le modal d'ajout
  closeAddModal(): void {
    this.showAddModal = false;
  }

  // Modifier une adresse
  editAddress(address: Address, event: Event): void {
    event.stopPropagation();
    this.selectedAddress = { ...address };
    this.showEditModal = true;
  }

  // Supprimer une adresse
  deleteAddress(address: Address, event: Event): void {
    event.stopPropagation();
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette adresse ?`)) {
      this.addresses = this.addresses.filter(a => a.id !== address.id);
    }
  }

  // Définir comme adresse par défaut
  setAsDefault(address: Address): void {
    this.addresses.forEach(a => {
      a.isDefault = a.id === address.id;
    });
  }

  // Obtenir la classe CSS selon le type
  getTypeClass(type: string): string {
    switch (type) {
      case 'Domicile':
        return 'type-home';
      case 'Bureau':
        return 'type-office';
      case 'Autre':
        return 'type-other';
      default:
        return '';
    }
  }

  // Obtenir la couleur de bordure pour l'adresse par défaut
  getCardClass(address: Address): string {
    return address.isDefault ? 'address-card-default' : '';
  }
}
