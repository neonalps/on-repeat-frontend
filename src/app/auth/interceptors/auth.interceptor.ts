import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@src/app/auth/auth.service';
import { TokenResponseDto } from '@src/app/models';
import { hasText } from '@src/app/util/common';
import { getNow } from '@src/app/util/date';
import { catchError, switchMap, throwError } from 'rxjs';

const excludedUrls: string[] = [
  AuthService.OAUTH_LOGIN_URL,
  AuthService.REFRESH_TOKEN_URL,
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (excludedUrls.includes(req.url)) {
    return next(req);
  }

  let authReq = req;
  const authService = inject(AuthService);
  const currentAccessToken = authService.getAccessToken();

  const currentAccessTokenExpiresAt = authService.getAccessTokenExpiresAt();
  if (currentAccessTokenExpiresAt !== null && getNow() <= currentAccessTokenExpiresAt) {
    authReq = addAuthHeader(req, currentAccessToken as string);
    return next(authReq);
  } 

  const currentRefreshToken = authService.getRefreshToken();
  const currentRefreshTokenExpiresAt = authService.getRefreshTokenExpiresAt();
  console.log('current refr', currentRefreshToken, currentAccessTokenExpiresAt);
  if (hasText(currentRefreshToken) && currentRefreshTokenExpiresAt != null && getNow() <= currentRefreshTokenExpiresAt) {
    console.log('refreshing')
    return authService.refreshAccessToken(currentRefreshToken as string).pipe(
      switchMap((tokenResponse: TokenResponseDto) => {
        authReq = addAuthHeader(req, tokenResponse.accessToken);
        return next(authReq);
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    )
  }

  return next(authReq).pipe(
    catchError(error => {
      console.error(error);
      authService.signOut();
      return throwError(() => error);
    })
  );
};

function addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({ headers: request.headers.set("Authorization", `Bearer ${token}`) });
}