// ==========================================
// CONTACT COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface ContactHistory {
  id: string;
  date: Date;
  subject: string;
  status: 'pending' | 'answered' | 'closed';
  response?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  // Formulaire
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  };

  // États
  isSubmitting = false;
  showHistory = false;
  showFAQ = false;

  // Catégories
  categories = [
    { value: 'general', label: 'Question générale' },
    { value: 'technical', label: 'Problème technique' },
    { value: 'billing', label: 'Facturation' },
    { value: 'feature', label: 'Demande de fonctionnalité' },
    { value: 'bug', label: 'Signaler un bug' },
    { value: 'other', label: 'Autre' }
  ];

  // Historique des contacts
  contactHistory: ContactHistory[] = [
    {
      id: '1',
      date: new Date('2025-01-05'),
      subject: 'Problème de connexion',
      status: 'answered',
      response: 'Votre problème a été résolu. Veuillez réessayer.'
    },
    {
      id: '2',
      date: new Date('2025-01-03'),
      subject: 'Question sur les stocks',
      status: 'closed'
    }
  ];

  // FAQ
  faqItems = [
    {
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions.',
      expanded: false
    },
    {
      question: 'Comment ajouter un nouveau membre ?',
      answer: 'Allez dans Mon Équipe > Ajouter, remplissez le formulaire et validez.',
      expanded: false
    },
    {
      question: 'Comment exporter les rapports ?',
      answer: 'Dans chaque page de rapport, cliquez sur le bouton "Exporter" en haut à droite.',
      expanded: false
    },
    {
      question: 'Qui contacter en cas d\'urgence ?',
      answer: 'Appelez le support au +33 1 23 45 67 89 (disponible 24/7).',
      expanded: false
    }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  // ===== GESTION DU FORMULAIRE =====

  loadUserInfo(): void {
    // Charger les infos de l'utilisateur si connecté
    const userProfile = localStorage.getItem('user_profile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      this.contactForm.name = `${profile.firstName} ${profile.lastName}`;
      this.contactForm.email = profile.email || '';
    }
  }

  validateForm(): boolean {
    const { name, email, subject, message } = this.contactForm;

    if (!name || !email || !subject || !message) {
      this.notificationService.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.notificationService.error('Adresse email invalide');
      return false;
    }

    // Validation longueur message
    if (message.length < 10) {
      this.notificationService.error('Le message doit contenir au moins 10 caractères');
      return false;
    }

    return true;
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    this.isSubmitting = true;

    // Simuler l'envoi
    setTimeout(() => {
      // Ajouter à l'historique
      const newContact: ContactHistory = {
        id: Date.now().toString(),
        date: new Date(),
        subject: this.contactForm.subject,
        status: 'pending'
      };
      this.contactHistory.unshift(newContact);

      this.notificationService.success(
        'Votre message a été envoyé avec succès !',
        3000,
        { title: 'Message envoyé' }
      );

      this.resetForm();
      this.isSubmitting = false;
    }, 1500);
  }

  resetForm(): void {
    this.contactForm = {
      name: this.contactForm.name,
      email: this.contactForm.email,
      subject: '',
      message: '',
      priority: 'medium',
      category: 'general'
    };
  }

  // ===== GESTION DE L'HISTORIQUE =====

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    this.showFAQ = false;
  }

  viewContactDetails(contact: ContactHistory): void {
    console.log('Voir détails du contact:', contact);
    this.notificationService.info(`Contact du ${contact.date.toLocaleDateString()}`);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'answered': 'Répondu',
      'closed': 'Fermé'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': '🟡',
      'answered': '✅',
      'closed': '🔒'
    };
    return icons[status] || '📧';
  }

  // ===== GESTION FAQ =====

  toggleFAQ(): void {
    this.showFAQ = !this.showFAQ;
    this.showHistory = false;
  }

  toggleFAQItem(item: any): void {
    item.expanded = !item.expanded;
  }

  // ===== ACTIONS RAPIDES =====

  callSupport(): void {
    this.notificationService.info('Appel du support : +33 1 23 45 67 89');
  }

  openChat(): void {
    this.notificationService.info('Chat en direct bientôt disponible');
  }

  scheduleCall(): void {
    this.notificationService.info('Fonction de planification d\'appel en cours de développement');
  }

  // ===== UTILITAIRES =====

  getCategoryLabel(value: string): string {
    const category = this.categories.find(c => c.value === value);
    return category ? category.label : value;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute'
    };
    return labels[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': 'success',
      'medium': 'warning',
      'high': 'danger'
    };
    return colors[priority] || 'info';
  }
}
