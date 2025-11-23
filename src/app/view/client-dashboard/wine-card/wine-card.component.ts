import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Wine {
  id: number;
  name: string;
  region: string;
  price: number;
  image: string;
  rating: number;
  year: number;
  cave: string;
}

@Component({
  selector: 'app-wine-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wine-card.component.html',
  styleUrls: ['./wine-card.component.scss']
})
export class WineCardComponent {
  @Input() wine!: Wine;
  @Input() isFavorite = false;

  @Output() toggleFavorite = new EventEmitter<Wine>();
  @Output() addToCart = new EventEmitter<Wine>();

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.toggleFavorite.emit(this.wine);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.wine);
  }
}
