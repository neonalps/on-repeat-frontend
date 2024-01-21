import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginResponseDto, TokenResponseDto } from '@src/app/models';
import { environment } from '@src/environments/environment';
import { validateNotBlank } from '@src/app/util/validation';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthState, selectAuthUser } from '@src/app/auth/store/auth.selectors';
import { AppState } from '@src/app/store.index';
import { SessionStorageService } from '@src/app/storage/session-storage.service';
import { hasText, isDefined } from '@src/app/util/common';
import { login, logout } from '@src/app/auth/store/auth.actions';
import { parseJwt } from '@src/app/util/token';
import { getDateFromUnixTimestamp } from '../util/date';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static readonly OAUTH_LOGIN_URL =`${environment.apiBaseUrl}/api/v1/oauth/login`;
  public static readonly REFRESH_TOKEN_URL =`${environment.apiBaseUrl}/api/v1/oauth/refresh-token`;

  private static readonly SESSION_STORAGE_KEY_AUTH = "currentAuth";

  private user: AuthUser | null = null;
  
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly sessionStorageService: SessionStorageService,
    private readonly store: Store<AppState>,
  ) {}

  public init(): void {
    const storedAuth = this.sessionStorageService.get(AuthService.SESSION_STORAGE_KEY_AUTH);
    if (hasText(storedAuth)) {
      try {
        const parsedStoredAuth: AuthUser = JSON.parse(storedAuth as string);
        this.store.dispatch(login({ auth: { isLoggedIn: true, auth: parsedStoredAuth } }));
      } catch {
        this.sessionStorageService.remove(AuthService.SESSION_STORAGE_KEY_AUTH);
      }
    }

    this.store.select(selectAuthUser)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.user = value;

        if (isDefined(value)) {
          this.sessionStorageService.put(AuthService.SESSION_STORAGE_KEY_AUTH, JSON.stringify(value));
        } else {
          this.sessionStorageService.remove(AuthService.SESSION_STORAGE_KEY_AUTH);
        }
      });
  }

  public handleOAuthLogin(provider: string, code: string): Observable<LoginResponseDto> {
    validateNotBlank(provider, "provider");
    validateNotBlank(code, "code");

    return this.http.post<LoginResponseDto>(AuthService.OAUTH_LOGIN_URL, {
      provider,
      code,
    }).pipe(
      tap((authResponse: LoginResponseDto) => {
        const accessToken = authResponse.token.accessToken;
          const accessTokenPayload = parseJwt(accessToken);
          const accessTokenExpiresAtUnix: number = accessTokenPayload["exp"];

          const refreshToken = authResponse.token.refreshToken;
          const refreshTokenPayload = parseJwt(refreshToken);
          const refreshTokenExpiresAtUnix: number = refreshTokenPayload["exp"];

          const authState: AuthState = {
            isLoggedIn: true,
            auth: {
              userId: authResponse.identity.publicId,
              username: authResponse.identity.displayName,
              email: authResponse.identity.email,
              accessToken,
              accessTokenExpiresAt: getDateFromUnixTimestamp(accessTokenExpiresAtUnix).toISOString(),
              refreshToken,
              refreshTokenExpiresAt: getDateFromUnixTimestamp(refreshTokenExpiresAtUnix).toISOString(),
            },
          };

          this.store.dispatch(login({ auth: authState }));
      })
    );
  }

  public refreshAccessToken(refreshToken: string): Observable<TokenResponseDto> {
    validateNotBlank(refreshToken, "refreshToken");

    return this.http.post<TokenResponseDto>(AuthService.REFRESH_TOKEN_URL, {
      refreshToken,
    });
  }

  public signOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

  public isLoggedIn(): boolean {
    return this.user !== null;
  }

  public getAccessToken(): string | null {
    return this.user !== null ? this.user.accessToken : null;
  }

  public getAccessTokenExpiresAt(): Date | null {
    return this.user !== null ? new Date(this.user.accessTokenExpiresAt) : null;
  }

  public getRefreshToken(): string | null {
    return this.user !== null ? this.user.refreshToken : null;
  }

  public getRefreshTokenExpiresAt(): Date | null {
    return this.user !== null ? new Date(this.user.refreshTokenExpiresAt) : null;
  }

}
