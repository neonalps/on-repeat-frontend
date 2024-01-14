import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AccountTokenApiDto } from '@src/app/models';
import { DeleteComponent } from '@src/app/components/delete/delete.component';

@Component({
  selector: 'app-account-token',
  standalone: true,
  imports: [CommonModule, DatePipe, DeleteComponent, I18nPipe],
  templateUrl: './account-token.component.html',
  styleUrl: './account-token.component.css'
})
export class AccountTokenComponent {
  @Input() accountToken!: AccountTokenApiDto;
  @Output() onDelete = new EventEmitter<string>();

  delete(): void {
    this.onDelete.emit(this.accountToken.publicId);
  }

  getProviderName(): string {
    return this.accountToken.provider;
  }

  getScopes(): string[] {
    return this.accountToken.scopes;
  }

  getCreatedAt(): Date {
    return this.accountToken.createdAt;
  }
}
