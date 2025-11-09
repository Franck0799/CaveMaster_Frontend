// ==========================================
// FICHIER: src/app/server/profile/profile.component.ts
// DESCRIPTION: Profil personnel du serveur
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  hireDate: Date;
  birthDate?: Date;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Statistic {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-profile',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserProfile = {
    id: 1,
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@wineflow.com',
    phone: '+33 6 12 34 56 78',
    role: 'Serveuse',
    hireDate: new Date(2023, 5, 15),
    birthDate: new Date(1998, 3, 20),
    address: '15 Rue de la Paix, 75002 Paris',
    emergencyContact: {
      name: 'Pierre Dubois',
      phone: '+33 6 98 76 54 32',
      relationship: 'Frère'
    }
  };

  statistics: Statistic[] = [
    {
      label: 'Jours travaillés',
      value: 245,
      icon: 'calendar',
      color: 'primary'
    },
    {
      label: 'Ventes totales',
      value: '45,780 €',
      icon: 'trending-up',
      color: 'success'
    },
    {
      label: 'Tables servies',
      value: 1250,
      icon: 'grid',
      color: 'info'
    },
    {
      label: 'Note moyenne',
      value: '4.8/5',
      icon: 'star',
      color: 'warning'
    }
  ];

  achievements: Achievement[] = [
    {
      id: 1,
      title: '100 Tables Servies',
      description: 'Servir 100 tables avec succès',
      icon: 'award',
      earnedDate: new Date(2023, 8, 10),
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Expert en Vins',
      description: 'Suggérer 50 accords mets-vins',
      icon: 'wine',
      earnedDate: new Date(2023, 10, 5),
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'Service Parfait',
      description: 'Obtenir 10 notes 5/5 consécutives',
      icon: 'star',
      earnedDate: new Date(2024, 1, 20),
      rarity: 'epic'
    },
    {
      id: 4,
      title: 'Record Mensuel',
      description: 'Meilleure vendeuse du mois',
      icon: 'trophy',
      earnedDate: new Date(2024, 9, 1),
      rarity: 'legendary'
    }
  ];

  editMode = false;
  editedUser: Partial<UserProfile> = {};
  showPasswordModal = false;

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor() {}

  ngOnInit(): void {
    this.editedUser = { ...this.user };
  }

  toggleEditMode(): void {
    if (this.editMode) {
      // Annuler les modifications
      this.editedUser = { ...this.user };
    }
    this.editMode = !this.editMode;
  }

  saveProfile(): void {
    // Validation
    if (!this.editedUser.firstName || !this.editedUser.lastName || !this.editedUser.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // TODO: Envoyer au backend
    console.log('Saving profile:', this.editedUser);

    this.user = { ...this.user, ...this.editedUser };
    this.editMode = false;

    alert('Profil mis à jour avec succès !');
  }

  uploadAvatar(): void {
    // TODO: Implémenter l'upload d'avatar
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.editedUser.avatar = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  openPasswordModal(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  changePassword(): void {
    // Validation
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.passwordForm.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // TODO: Envoyer au backend
    console.log('Changing password...');

    alert('Mot de passe modifié avec succès !');
    this.closePasswordModal();
  }

  getExperienceDuration(): string {
    const now = new Date();
    const hire = new Date(this.user.hireDate);
    const years = now.getFullYear() - hire.getFullYear();
    const months = now.getMonth() - hire.getMonth();

    let totalMonths = years * 12 + months;
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;

    if (displayYears > 0) {
      return `${displayYears} an${displayYears > 1 ? 's' : ''} ${displayMonths > 0 ? 'et ' + displayMonths + ' mois' : ''}`;
    }
    return `${displayMonths} mois`;
  }

  getAge(): number {
    if (!this.user.birthDate) return 0;
    const today = new Date();
    const birth = new Date(this.user.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getRarityColor(rarity: string): string {
    const colors: any = {
      'common': '#94a3b8',
      'rare': '#3b82f6',
      'epic': '#8b5cf6',
      'legendary': '#f59e0b'
    };
    return colors[rarity] || '#94a3b8';
  }

  getRarityLabel(rarity: string): string {
    const labels: any = {
      'common': 'Commun',
      'rare': 'Rare',
      'epic': 'Épique',
      'legendary': 'Légendaire'
    };
    return labels[rarity] || rarity;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
