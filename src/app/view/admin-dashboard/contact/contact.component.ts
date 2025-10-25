// ============================================
// CONTACT COMPONENT
// ============================================
// contact.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting: boolean = false;

  ngOnInit(): void {}

  submitForm(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;

      // TODO: Appel API
      setTimeout(() => {
        alert('Message envoyé avec succès !');
        this.resetForm();
        this.isSubmitting = false;
      }, 1500);
    }
  }

  validateForm(): boolean {
    if (!this.contactForm.name || !this.contactForm.email ||
        !this.contactForm.subject || !this.contactForm.message) {
      alert('Veuillez remplir tous les champs');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contactForm.email)) {
      alert('Adresse email invalide');
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}

