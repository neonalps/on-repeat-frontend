import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AccountTokenService } from '@src/app/services/account-tokens/account-token.service';
import { selectAuthUser } from '@src/app/auth/store/auth.selectors';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AccountJobApiDto, AccountTokenApiDto, AuthUser, OAuthConfig, PaginatedResponseDto, PlayedInfoApiDto, ProfileInfoApiDto } from '@src/app/models';
import { AppState } from '@src/app/store.index';
import { formatNumberWithThousandCommas, isDefined, isNotDefined } from '@src/app/util/common';
import { filter, first, take } from 'rxjs';
import { environment } from '@src/environments/environment';
import { OAuthContext } from '@src/app/oauth/spotify/oauth.spotify.component';
import { encode } from '@src/app/util/base64';
import { AccountTokenComponent } from '@src/app/components/account-token/account-token.component';
import { ModalEvent, ModalOptions, ModalService } from '@src/app/modal/modal.service';
import { TranslationService } from '@src/app/i18n/translation.service';
import { AccountJobComponent } from '@src/app/components/account-job/account-job.component';
import { AccountJobService } from '@src/app/services/account-jobs/account-job.service';
import { ProfileService } from '@src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AccountJobComponent,
    AccountTokenComponent,
    CommonModule, 
    I18nPipe, 
    LoadingComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  accountJobs: AccountJobApiDto[] = [];
  accountJobsLoading: boolean = false;
  accountTokens: AccountTokenApiDto[] = [];
  accountTokensLoading: boolean = false;
  loading: boolean = false;
  playedInfo: PlayedInfoApiDto | null = null;
  username: string | null = null;

  constructor(
    private readonly accountJobService: AccountJobService,
    private readonly accountTokenService: AccountTokenService,
    private readonly profileService: ProfileService,
    private readonly modalService: ModalService,
    private readonly store: Store<AppState>,
    private readonly translationService: TranslationService,
  ) {
    this.store.select(selectAuthUser)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.username = isDefined(value) ? (value as AuthUser).username : null;
      });
      this.loadProfileInfo();
  }

  connectSpotify(): void {
    const config: OAuthConfig = environment.oauth?.spotify;
    if (!config) {
      throw new Error("Failed to read Spotify OAuth config");
    }

    const context: OAuthContext = { type: 'accountToken' };

    const queryParams = {
      state: encode(JSON.stringify({ context })),
      response_type: "code",
      client_id: config.clientId,
      scope: "user-read-private user-read-email user-read-recently-played",
      redirect_uri: config.redirectUri,
    };
    
    window.location.href = [config.authorizeUrl, "?", new URLSearchParams(queryParams).toString()].join("");
  }

  confirmAccountTokenDeletion(accountTokenId: string): void {
    const modalOptions: ModalOptions = {
      title: this.translationService.translate("deleteAccountToken.title"),
      content: this.translationService.translate("deleteAccountToken.content"),
      cancelText: this.translationService.translate("cancel"),
      confirmText: this.translationService.translate("delete"),
      isDelete: true,
    };

    this.modalService.showModal(modalOptions)
      .pipe(
        filter((event: ModalEvent) => event.type === 'confirm'),
        take(1),
      )
      .subscribe({
        next: () => this.handleDeleteAccountToken(accountTokenId),
      });
  }

  disableAccountJob(accountJobId: number): void {
    this.accountJobService.disableAccountJob(accountJobId)
      .pipe(first())
      .subscribe({
        next: (updatedAccountJob: AccountJobApiDto) => {
          this.replaceAccountJob(updatedAccountJob);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  enableAccountJob(accountJobId: number): void {
    this.accountJobService.enableAccountJob(accountJobId)
      .pipe(first())
      .subscribe({
        next: (updatedAccountJob: AccountJobApiDto) => {
          this.replaceAccountJob(updatedAccountJob);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  handleDeleteAccountToken(accountTokenId: string): void {
    this.accountTokensLoading = true;

    this.accountTokenService.deleteAccountToken(accountTokenId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loadAccountTokens();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.accountTokensLoading = false;
        }
      })
  }

  getFirstPlayedAt(): Date | null {
    return this.playedInfo === null ? null : this.playedInfo.firstPlayedAt;  
  }

  getLastPlayedAt(): Date | null {
    return this.playedInfo === null ? null : this.playedInfo.lastPlayedAt;
  }

  getTimesPlayed(): string {
    return this.playedInfo === null ? "-" : formatNumberWithThousandCommas(this.playedInfo.timesPlayed);
  }

  private loadProfileInfo(): void {
    this.loading = true;
    this.accountJobsLoading = true;
    this.accountTokensLoading = true;

    this.profileService.fetchProfileInfo()
      .pipe(first())
      .subscribe({
        next: (response: ProfileInfoApiDto) => {
          this.accountJobs = response.accountJobs.items;
          this.accountTokens = response.accountTokens.items;
          this.playedInfo = response.playedInfo;
          this.loading = false;
          this.accountJobsLoading = false;
          this.accountTokensLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.loading = false;
          this.accountJobsLoading = false;
          this.accountTokensLoading = false;
        } 
      });
  }

  private loadAccountTokens(): void {
    this.accountTokensLoading = true;

    this.accountTokenService.fetchAccountTokens()
      .pipe(first())
      .subscribe({
        next: (response: PaginatedResponseDto<AccountTokenApiDto>) => {
          this.accountTokens = response.items;
          this.accountTokensLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.accountTokensLoading = false;
        } 
      });
  }

  private replaceAccountJob(accountJobToReplace: AccountJobApiDto): void {
    if (isNotDefined(accountJobToReplace)) {
      return;
    }

    const existingAccountJobIdx = this.accountJobs.findIndex(job => job.id === accountJobToReplace.id);
    if (existingAccountJobIdx === -1) {
      return;
    }

    this.accountJobs[existingAccountJobIdx] = accountJobToReplace;
  }
}
