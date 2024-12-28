import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountJobApiDto, PaginatedResponseDto } from '@src/app/models';
import { API_QUERY_PARAM_NEXT_PAGE_KEY, isDefined } from '@src/app/util/common';

@Injectable({
  providedIn: 'root'
})
export class AccountJobService {

  private static readonly ACCOUNT_JOB_URL =`${environment.apiBaseUrl}/api/v1/account-jobs`;

  constructor(private readonly http: HttpClient) {}

  fetchAccountJobs(nextPageKey?: string): Observable<PaginatedResponseDto<AccountJobApiDto>> {
    const queryParams = new URLSearchParams();
    if (isDefined(nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, nextPageKey as string);
    }

    const requestUrl = `${AccountJobService.ACCOUNT_JOB_URL}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<AccountJobApiDto>>(requestUrl);
  }

  disableAccountJob(accountJobId: number): Observable<AccountJobApiDto> {
    const requestUrl = `${AccountJobService.ACCOUNT_JOB_URL}/${accountJobId}/disable`;
    return this.http.post<AccountJobApiDto>(requestUrl, null);
  }

  enableAccountJob(accountJobId: number): Observable<AccountJobApiDto> {
    const requestUrl = `${AccountJobService.ACCOUNT_JOB_URL}/${accountJobId}/enable`;
    return this.http.post<AccountJobApiDto>(requestUrl, null);
  }

}
