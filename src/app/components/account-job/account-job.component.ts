import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { TranslationService } from '@src/app/i18n/translation.service';
import { AccountJobApiDto } from '@src/app/models';
import { isDefined } from '@src/app/util/common';
import { formatJobDate } from '@src/app/util/date';

@Component({
  selector: 'app-account-job',
  standalone: true,
  imports: [CommonModule, DatePipe, I18nPipe],
  templateUrl: './account-job.component.html',
  styleUrl: './account-job.component.css'
})
export class AccountJobComponent {

  @Input() accountJob!: AccountJobApiDto;
  @Output() onDisable = new EventEmitter<number>();
  @Output() onEnable = new EventEmitter<number>();

  constructor(private readonly translationService: TranslationService) {}

  disable(): void {
    this.onDisable.emit(this.accountJob.id);
  }

  enable(): void {
    this.onEnable.emit(this.accountJob.id);
  }

  getDisplayName(): string {
    return this.accountJob.displayName;
  }

  getCreatedAt(): Date {
    return this.accountJob.createdAt;
  }

  getEnabledText(): string {
    return this.translationService.translate(this.accountJob.enabled ? "yes" : "no");
  }

  getLastSuccessfulRun(): string | null {
    const lastSuccessfulRun = this.accountJob.lastSuccessfulExecution;
    return isDefined(lastSuccessfulRun) ? formatJobDate(lastSuccessfulRun as Date) : this.translationService.translate("never");
  }

  getNextScheduledRun(): string | null {
    const nextScheduledRun = this.accountJob.nextScheduledRun;
    return isDefined(nextScheduledRun) ? formatJobDate(nextScheduledRun as Date) : this.translationService.translate("never");
  }

  isEnabled(): boolean {
    return this.accountJob.enabled;
  }

}
