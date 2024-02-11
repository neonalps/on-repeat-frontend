import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { AccountChartApiDto, AccountChartDetailsApiDto, AccountChartItemApiDto, ChartApiDto, PaginatedResponseDto } from '@src/app/models';
import { API_QUERY_PARAM_NEXT_PAGE_KEY, isDefined } from '@src/app/util/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private static readonly CHARTS_URL =`${environment.apiBaseUrl}/api/v1/charts`;

  constructor(private readonly http: HttpClient) {}

  public fetchAccountCharts(nextPageKey?: string): Observable<PaginatedResponseDto<AccountChartApiDto>> {
    const queryParams = new URLSearchParams();
    if (isDefined(nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, nextPageKey as string);
    }

    const requestUrl = `${ChartService.CHARTS_URL}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<AccountChartApiDto>>(requestUrl);
  }

  public fetchAccountChartDetails(accountChartId: number): Observable<AccountChartDetailsApiDto<unknown>> {
    const requestUrl = `${ChartService.CHARTS_URL}/${accountChartId}`;
    return this.http.get<AccountChartDetailsApiDto<unknown>>(requestUrl);
  }

  public fetchAccountAdHocCharts(type: string, from: number, to?: number, limit?: number): Observable<ChartApiDto<AccountChartItemApiDto<unknown>>> {
    const queryParams = new URLSearchParams({
      from: from.toString(),
      type
    });

    if (!!to) {
      queryParams.append("to", to.toString());
    }

    if (!!limit) {
      queryParams.append("limit", limit.toString());
    }

    const requestUrl = `${ChartService.CHARTS_URL}/ad-hoc?${queryParams.toString()}`;
    return this.http.get<ChartApiDto<AccountChartItemApiDto<unknown>>>(requestUrl);
  }

}
