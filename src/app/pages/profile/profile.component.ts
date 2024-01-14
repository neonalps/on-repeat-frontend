import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountTokenService } from '@src/app/account-tokens/account-token.service';
import { AuthService } from '@src/app/auth/auth.service';
import { loginRedirect } from '@src/app/auth/guards/loggedin.guard';
import { selectAuthUser } from '@src/app/auth/store/auth.selectors';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AccountTokenApiDto, AuthUser, OAuthConfig, PaginatedResponseDto } from '@src/app/models';
import { AppState } from '@src/app/store.index';
import { isDefined } from '@src/app/util/common';
import { filter, first, take } from 'rxjs';
import { environment } from '@src/environments/environment';
import { OAuthContext } from '@src/app/oauth/spotify/oauth.spotify.component';
import { encode } from '@src/app/util/base64';
import { AccountTokenComponent } from '@src/app/components/account-token/account-token.component';
import { ModalEvent, ModalOptions, ModalService } from '@src/app/modal/modal.service';
import { TranslationService } from '@src/app/i18n/translation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AccountTokenComponent,
    CommonModule, 
    I18nPipe, 
    LoadingComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  accountTokens: AccountTokenApiDto[] = [];
  loading: boolean = false;
  username: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly accountTokenService: AccountTokenService,
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly translationService: TranslationService,
  ) {
    this.store.select(selectAuthUser)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.username = isDefined(value) ? (value as AuthUser).username : null;
      });

      this.loadAccountTokens();
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

  handleDeleteAccountToken(accountTokenId: string): void {
    this.loading = true;

    this.accountTokenService.deleteAccountToken(this.authService.getAccessToken() as string, accountTokenId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loadAccountTokens();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            loginRedirect(this.router, this.router.url);
            return;
          }

          // TODO show error toast
          this.loading = false;
        }
      })
  }

  private loadAccountTokens(): void {
    this.loading = true;

    this.accountTokenService.fetchAccountTokens(this.authService.getAccessToken() as string)
      .pipe(first())
      .subscribe({
        next: (response: PaginatedResponseDto<AccountTokenApiDto>) => {
          this.accountTokens = response.items;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            loginRedirect(this.router, this.router.url);
            return;
          }

          this.loading = false;
        } 
      });
  }
}
