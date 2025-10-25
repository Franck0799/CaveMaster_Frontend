// AU CAS OÙ J'AURAIS BESOIN D'UN SERVICE DE MODALITÉS GÉNÉRAL

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalState {
  isProfileModalOpen: boolean;
  isCaveModalOpen: boolean;
  isAddCaveModalOpen: boolean;
  isAddManagerModalOpen: boolean;
  isAddEmployeeModalOpen: boolean;
  selectedCave?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<ModalState>({
    isProfileModalOpen: false,
    isCaveModalOpen: false,
    isAddCaveModalOpen: false,
    isAddManagerModalOpen: false,
    isAddEmployeeModalOpen: false,
    selectedCave: undefined
  });

  modalState$ = this.modalState.asObservable();

  openProfileModal(): void {
    this.updateState({ isProfileModalOpen: true });
  }

  closeProfileModal(): void {
    this.updateState({ isProfileModalOpen: false });
  }

  openCaveModal(cave: any): void {
    this.updateState({
      isCaveModalOpen: true,
      selectedCave: cave
    });
  }

  closeCaveModal(): void {
    this.updateState({
      isCaveModalOpen: false,
      selectedCave: undefined
    });
  }

  openAddCaveModal(): void {
    this.updateState({ isAddCaveModalOpen: true });
  }

  closeAddCaveModal(): void {
    this.updateState({ isAddCaveModalOpen: false });
  }

  openAddManagerModal(): void {
    this.updateState({ isAddManagerModalOpen: true });
  }

  closeAddManagerModal(): void {
    this.updateState({ isAddManagerModalOpen: false });
  }

  openAddEmployeeModal(): void {
    this.updateState({ isAddEmployeeModalOpen: true });
  }

  closeAddEmployeeModal(): void {
    this.updateState({ isAddEmployeeModalOpen: false });
  }

  private updateState(partialState: Partial<ModalState>): void {
    this.modalState.next({
      ...this.modalState.value,
      ...partialState
    });
  }
}
