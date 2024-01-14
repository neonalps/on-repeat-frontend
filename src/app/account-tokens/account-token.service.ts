import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable, first } from 'rxjs';
import { AccountTokenApiDto, CreateAccountTokenResponseDto, PaginatedResponseDto } from '@src/app/models';
import { API_QUERY_PARAM_NEXT_PAGE_KEY, isDefined } from '@src/app/util/common';
import { getHeaderWithAuthorization } from '@src/app/util/http';
import { validateNotBlank } from '@src/app/util/validation';

@Injectable({
  providedIn: 'root'
})
export class AccountTokenService {

  private static readonly ACCOUNT_TOKEN_URL =`${environment.apiBaseUrl}/api/v1/account-tokens`;

  constructor(private readonly http: HttpClient) {}

  fetchAccountTokens(accessToken: string, nextPageKey?: string): Observable<PaginatedResponseDto<AccountTokenApiDto>> {
    const queryParams = new URLSearchParams();
    if (isDefined(nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, nextPageKey as string);
    }

    const requestUrl = `${AccountTokenService.ACCOUNT_TOKEN_URL}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<AccountTokenApiDto>>(requestUrl, getHeaderWithAuthorization(accessToken));
  }

  createAccountToken(accessToken: string, provider: string, code: string): Observable<CreateAccountTokenResponseDto> {
    validateNotBlank(accessToken, "accessToken");
    validateNotBlank(provider, "provider");
    validateNotBlank(code, "code");

    return this.http.post<CreateAccountTokenResponseDto>(AccountTokenService.ACCOUNT_TOKEN_URL, {
      provider,
      code,
      createFetchRecentlyPlayedTracksJob: true,
    }, getHeaderWithAuthorization(accessToken));
  }

  deleteAccountToken(accessToken: string, accountTokenId: string) {
    validateNotBlank(accountTokenId, "accountTokenId");

    return this.http.delete(`${AccountTokenService.ACCOUNT_TOKEN_URL}/${accountTokenId}`, getHeaderWithAuthorization(accessToken));
  }
}
