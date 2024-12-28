import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/auth/auth.service';
import { hasText, isDefined } from '@src/app/util/common';
import { first } from 'rxjs';
import { decode } from '@src/app/util/base64';
import { AccountTokenService } from '@src/app/services/account-tokens/account-token.service';

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
    if (!hasText(contextType) || ["login", "accountToken"].indexOf(contextType) < 0) {
      throw new Error(`Illegal context type value ${contextType}`);
    }

    switch (contextType) {
      case "login":
        const targetUrl: string | undefined = hasText(decodedState["target"] as any) ? decodedState["target"] as string : undefined;
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
        next: _ => {
          setTimeout(() => this.router.navigate([isDefined(targetUrl) ? targetUrl : "/"]));
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private handleAccountToken(code: string): void {
    this.accountTokenService.createAccountToken("spotify", code)
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