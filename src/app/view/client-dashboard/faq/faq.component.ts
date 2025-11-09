// ==========================================
// FICHIER: src/app/client/faq/faq.component.ts
// DESCRIPTION: Page FAQ (questions fréquentes)
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  // Catégories
  categories: Category[] = [
    { name: 'Commandes', icon: '📦', count: 5 },
    { name: 'Livraison', icon: '🚚', count: 4 },
    { name: 'Paiement', icon: '💳', count: 3 },
    { name: 'Produits', icon: '🍷', count: 6 },
    { name: 'Compte', icon: '👤', count: 4 }
  ];

  // Catégorie sélectionnée
  selectedCategory = 'Toutes';

  // Recherche
  searchQuery = '';

  // Questions fréquentes
  faqs: FAQ[] = [
    {
      id: 1,
      category: 'Commandes',
      question: 'Comment passer une commande ?',
      answer: 'Pour passer une commande, parcourez notre catalogue, ajoutez les vins à votre panier, puis cliquez sur "Commander". Suivez ensuite les étapes de validation pour finaliser votre achat.',
      isOpen: false
    },
    {
      id: 2,
      category: 'Commandes',
      question: 'Puis-je annuler ma commande ?',
      answer: 'Oui, vous pouvez annuler votre commande dans les 2 heures suivant sa validation. Au-delà, contactez notre service client.',
      isOpen: false
    },
    {
      id: 3,
      category: 'Commandes',
      question: 'Comment suivre ma commande ?',
      answer: 'Rendez-vous dans "Mes Commandes" pour suivre l\'état de vos commandes en temps réel. Vous recevrez également des notifications par email.',
      isOpen: false
    },
    {
      id: 4,
      category: 'Livraison',
      question: 'Quels sont les délais de livraison ?',
      answer: 'La livraison standard prend 2-5 jours ouvrables. La livraison express (24-48h) est disponible pour certaines régions.',
      isOpen: false
    },
    {
      id: 5,
      category: 'Livraison',
      question: 'Quels sont les frais de livraison ?',
      answer: 'Les frais de livraison varient selon votre localisation. Livraison gratuite pour les commandes supérieures à 100€.',
      isOpen: false
    },
    {
      id: 6,
      category: 'Paiement',
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money, virements bancaires et PayPal.',
      isOpen: false
    },
    {
      id: 7,
      category: 'Paiement',
      question: 'Le paiement est-il sécurisé ?',
      answer: 'Oui, toutes les transactions sont sécurisées avec un cryptage SSL. Vos données bancaires ne sont jamais stockées sur nos serveurs.',
      isOpen: false
    },
    {
      id: 8,
      category: 'Produits',
      question: 'Comment choisir le bon vin ?',
      answer: 'Utilisez nos filtres par type, région, et prix. Consultez aussi notre page "Conseils" pour des recommandations personnalisées.',
      isOpen: false
    },
    {
      id: 9,
      category: 'Produits',
      question: 'Les vins sont-ils authentiques ?',
      answer: 'Oui, nous travaillons uniquement avec des caves certifiées. Tous nos vins sont authentiques et traçables.',
      isOpen: false
    },
    {
      id: 10,
      category: 'Produits',
      question: 'Puis-je retourner un produit ?',
      answer: 'Les retours sont acceptés dans les 14 jours si le produit n\'a pas été ouvert. Contactez-nous pour initier un retour.',
      isOpen: false
    },
    {
      id: 11,
      category: 'Compte',
      question: 'Comment créer un compte ?',
      answer: 'Cliquez sur "S\'inscrire" en haut de la page, remplissez vos informations et validez votre email.',
      isOpen: false
    },
    {
      id: 12,
      category: 'Compte',
      question: 'Comment modifier mes informations ?',
      answer: 'Accédez à "Mon Compte" > "Paramètres" pour modifier vos informations personnelles.',
      isOpen: false
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialisation
  }

  // Obtenir les FAQs filtrées
  get filteredFaqs(): FAQ[] {
    return this.faqs.filter(faq => {
      const matchCategory = this.selectedCategory === 'Toutes' || faq.category === this.selectedCategory;
      const matchSearch = this.searchQuery === '' ||
                         faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  // Sélectionner une catégorie
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  // Toggle FAQ
  toggleFaq(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }
}
