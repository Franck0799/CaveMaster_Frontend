// ============================================
// FAQ COMPONENT
// ============================================
// faq.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = 'all';

  categories: string[] = [
    'Général',
    'Gestion des stocks',
    'Employés et Managers',
    'Facturation',
    'Technique'
  ];

  faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'Général',
      question: 'Comment créer une nouvelle cave ?',
      answer: 'Pour créer une nouvelle cave, rendez-vous dans le menu "Mes Caves" puis cliquez sur le bouton "Ajouter une cave". Remplissez le formulaire avec le nom, l\'emplacement et les informations nécessaires.',
      isOpen: false
    },
    {
      id: '2',
      category: 'Gestion des stocks',
      question: 'Comment ajouter des produits au stock ?',
      answer: 'Allez dans "Mes boissons" > "Ajouter une boisson", ou utilisez le scanner de code-barres pour une entrée rapide. Vous pouvez également importer un fichier CSV avec plusieurs produits.',
      isOpen: false
    },
    {
      id: '3',
      category: 'Employés et Managers',
      question: 'Comment assigner un employé à un manager ?',
      answer: 'Dans la section "Mes Employés", lors de l\'ajout ou la modification d\'un employé, sélectionnez le manager de supervision dans la liste déroulante.',
      isOpen: false
    },
    {
      id: '4',
      category: 'Technique',
      question: 'L\'application fonctionne-t-elle hors ligne ?',
      answer: 'CaveMaster nécessite une connexion internet pour synchroniser les données. Cependant, certaines fonctions de consultation sont disponibles en mode hors ligne.',
      isOpen: false
    }
  ];

  filteredItems: FAQItem[] = [];

  ngOnInit(): void {
    this.filteredItems = [...this.faqItems];
  }

  toggleItem(item: FAQItem): void {
    item.isOpen = !item.isOpen;
  }

  filterFAQ(): void {
    this.filteredItems = this.faqItems.filter(item => {
      const matchesSearch = this.searchQuery === '' ||
        item.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = this.selectedCategory === 'all' ||
        item.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
}

