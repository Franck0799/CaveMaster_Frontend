// ========================================
// ===== SETTINGS COMPONENT =====
// ========================================

// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingsComponent implements OnInit {
  // Paramètres généraux
  nomEntreprise: string = 'DrinkStore';
  devise: string = 'FCFA';
  langue: string = 'fr';
  fuseau: string = 'Africa/Abidjan';

  // Notifications
  notifEmail: boolean = true;
  notifSMS: boolean = true;
  notifPush: boolean = true;
  notifStockFaible: boolean = true;
  notifNouvelleCommande: boolean = true;

  // Caisse
  fondCaisseDefaut: number = 50000;
  autoriserCredit: boolean = false;
  limiteCredit: number = 100000;

  // Stock
  seuilAlerteDefaut: number = 10;
  gestionLots: boolean = false;
  dateExpiration: boolean = true;

  ngOnInit(): void {
    console.log('Settings page loaded');
  }

  saveSettings(): void {
    console.log('Saving settings...');
    alert('Paramètres enregistrés avec succès !');
  }

  resetSettings(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres ?')) {
      console.log('Resetting settings...');
      alert('Paramètres réinitialisés !');
    }
  }
}

