import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicDashboardInformationApiDto } from '@src/app/models';
import { environment } from '@src/environments/environment';
import { Observable, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private static readonly BASIC_DASHBOARD_URL =`${environment.apiBaseUrl}/api/v1/dashboard`;

  private basicDashboard: BasicDashboardInformationApiDto | null = null;

  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<BasicDashboardInformationApiDto> {
    if (this.basicDashboard !== null) {
      return of(this.basicDashboard);
    }

    return this.fetchBasicDashboard()
      .pipe(
        take(1),
        tap((dashboard: BasicDashboardInformationApiDto) => {
          this.basicDashboard = dashboard;
        }),
      );
  }

  private fetchBasicDashboard(): Observable<BasicDashboardInformationApiDto> {
    return this.http.get<BasicDashboardInformationApiDto>(DashboardService.BASIC_DASHBOARD_URL);
  }
}
