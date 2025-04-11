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
  private dashboardDate: Date | null = null;

  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<BasicDashboardInformationApiDto> {
    if (this.basicDashboard !== null && this.isDashboardStillValid()) {
      return of(this.basicDashboard);
    }

    return this.fetchBasicDashboard()
      .pipe(
        take(1),
        tap((dashboard: BasicDashboardInformationApiDto) => {
          this.basicDashboard = dashboard;
          this.dashboardDate = new Date();
        }),
      );
  }

  private fetchBasicDashboard(): Observable<BasicDashboardInformationApiDto> {
    return this.http.get<BasicDashboardInformationApiDto>(DashboardService.BASIC_DASHBOARD_URL);
  }

  private isDashboardStillValid(): boolean {
    if (this.dashboardDate === null) {
      return false;
    }

    const now = new Date();
    return now.getDate() === this.dashboardDate.getDate() &&
        now.getMonth() === this.dashboardDate.getMonth() && 
        now.getFullYear() === this.dashboardDate.getFullYear();
  }

}
