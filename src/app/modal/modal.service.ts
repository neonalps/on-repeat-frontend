import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalOptions {
  title: string;
  content: string;
  cancelText: string;
  confirmText: string;
  isDelete: boolean;
}

export interface ModalEvent {
  type: 'cancel' | 'confirm',
  payload?: unknown,
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalSubject!: Subject<ModalEvent>;
  private active: boolean = false;
  private delete: boolean = false;
  private title: string = "";
  private content: string = "";
  private cancelText: string = "";
  private confirmText: string = "";

  constructor() {}

  showModal(options: ModalOptions) {
    if (this.active) {
      throw new Error("Only one modal can be active at a time");
    }

    this.title = options.title;
    this.content = options.content;
    this.cancelText = options.cancelText;
    this.confirmText = options.confirmText;
    this.delete = options.isDelete;
    this.active = true;

    this.modalSubject = new Subject<ModalEvent>();
    return this.modalSubject.asObservable();
  }

  onClose(): void {
    this.modalSubject.next({ type: 'cancel' });
    this.modalSubject.complete();
    this.active = false;
  }

  onConfirm(): void {
    this.modalSubject.next({ type: 'confirm' });
    this.modalSubject.complete();
    this.active = false;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getCancelText(): string {
    return this.cancelText;
  }

  getConfirmText(): string {
    return this.confirmText;
  }

  isActive(): boolean {
    return this.active;
  }

  isDelete(): boolean {
    return this.delete;
  }
}
