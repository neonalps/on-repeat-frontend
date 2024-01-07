import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '@src/app/auth/auth.service';
import { login } from '@src/app/auth/store/auth.actions';
import { AuthState } from '@src/app/auth/store/auth.selectors';
import { hasText, isDefined } from '@src/app/util/common';
import { parseJwt } from '@src/app/util/token';
import { getDateFromUnixTimestamp } from '@src/app/util/date';
import { first } from 'rxjs';
import { decode } from '@src/app/util/base64';
import { AccountTokenService } from '@src/app/account-tokens/account-token.service';

@Component({
  selector: 'app-oauth-spotify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth.spotify.component.html',
})
export class OauthSpotifyComponent implements OnInit {

  constructor(
    private readonly accountTokenService: AccountTokenService,
    private readonly authService: AuthService, 
    private readonly router: Router, 
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    const code: string = queryParams.get("code") as string;
    if (!hasText(code)) {
      throw new Error(`Spotify OAuth handler called without code`);
    }

    const state = queryParams.get("state");
    if (!hasText(state)) {
      throw new Error("Spotify OAuth handler called without state");
    }

    const decodedState: Record<string, unknown> = JSON.parse(decode(state as string));

    if (!isDefined(decodedState["context"] as any)) {
      throw new Error("Missing OAuth context in state parameter");
    }

    const contextType: string = (decodedState["context"] as OAuthContext).type;
    if (["login", "accountToken"].indexOf(contextType) < 0) {
      throw new Error(`Illegal context type value ${contextType}`);
    }

    switch (contextType) {
      case "login":
        const targetUrl: string | undefined = hasText(decodedState["targetUrl"] as any) ? decodedState["targetUrl"] as string : undefined;
        this.handleLogin(code, targetUrl);
        break;

      case "accountToken":
        this.handleAccountToken(code);
        break;
    }
  }

  private handleLogin(code: string, targetUrl?: string): void {
    this.authService.handleOAuthLogin("spotify", code)
      .pipe(first())
      .subscribe({
        next: authResponse => {
          const accessToken = authResponse.token.accessToken;
          const tokenPayload = parseJwt(accessToken);

          const accessTokenExpiresAtUnix: number = tokenPayload["exp"];

          const authState: AuthState = {
            isLoggedIn: true,
            auth: {
              userId: authResponse.identity.publicId,
              username: authResponse.identity.displayName,
              email: authResponse.identity.email,
              accessToken: accessToken,
              accessTokenExpiresAt: getDateFromUnixTimestamp(accessTokenExpiresAtUnix),
              refreshToken: null,
            },
          };

          this.store.dispatch(login({ auth: authState }));
          setTimeout(() => this.router.navigate([isDefined(targetUrl) ? targetUrl : "/"]), 100);
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private handleAccountToken(code: string): void {
    this.accountTokenService.createAccountToken(this.authService.getAccessToken() as string, "spotify", code)
      .pipe(first())
      .subscribe({
        next: _ => {
          this.router.navigate(["/profile"]);
        },
        error: error => {
          console.error(error);
        }
    });
  }
}

export interface OAuthContext {
  type: 'login' | 'accountToken';
}