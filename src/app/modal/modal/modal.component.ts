import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { CloseComponent } from '@src/app/components/close/close.component';
import { ModalService } from '@src/app/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CloseComponent, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  constructor(private readonly modalService: ModalService) {}

  close(): void {
    this.modalService.onClose();
  }

  confirm(): void {
    this.modalService.onConfirm();
  }

  getTitle(): string {
    return this.modalService.getTitle();
  }

  getContent(): string {
    return this.modalService.getContent();
  }

  getCancelIconColor(): string {
    return this.isDelete() ? '#b91c1c' : '#a96dad';
  }

  getCancelText(): string {
    return this.modalService.getCancelText();
  }

  getConfirmText(): string {
    return this.modalService.getConfirmText();
  }

  getCancelButtonStyle(): Object {
    return {
      'button-warning-secondary': this.isDelete(),
      'button-secondary': !this.isDelete(),
    };
  }

  getConfirmButtonStyle(): Object {
    return {
      'button-warning-primary': this.isDelete(),
      'button-primary': !this.isDelete(),
    };
  }

  getHeaderStyle(): Object {
    return {
      'text-warning': this.isDelete(),
      'border-warning': this.isDelete(),
      'text-primary': !this.isDelete(),
      'border-primary': !this.isDelete(),
    };
  }

  isActive(): boolean {
    return this.modalService.isActive();
  }

  isDelete(): boolean {
    return this.modalService.isDelete();
  }

}
