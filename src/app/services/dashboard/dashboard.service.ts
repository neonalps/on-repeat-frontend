import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable, take } from 'rxjs';
import { BasicDashboardInformationApiDto, ChartApiDto, ChartApiItem } from '@src/app/models';
import { isNotDefined } from '@src/app/util/common';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private static readonly BASIC_DASHBOARD_URL =`${environment.apiBaseUrl}/api/v1/dashboard`;

  private basicDashboard: BasicDashboardInformationApiDto | null = null;

  constructor(private readonly http: HttpClient) {}

  load(): void {
    if (this.basicDashboard !== null) {
      return;
    }

    this.fetchBasicDashboard()
      .pipe(take(1))
      .subscribe(dashboard => {
        this.basicDashboard = dashboard;
      });
  }

  getCurrentTrackCharts(): ChartApiDto<ChartApiItem> | null {
    if (isNotDefined(this.basicDashboard)) {
      return null;
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.tracks.current;
  }

  getCurrentArtistCharts(): ChartApiDto<ChartApiItem> | null {
    if (isNotDefined(this.basicDashboard)) {
      return null;
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.artists.current;
  }
  
  getAllTimeTrackCharts(): ChartApiDto<ChartApiItem> | null {
    if (isNotDefined(this.basicDashboard)) {
      return null;
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.tracks.allTime;
  }

  getAllTimeArtistCharts(): ChartApiDto<ChartApiItem> | null {
    if (isNotDefined(this.basicDashboard)) {
      return null;
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.artists.allTime;
  }

  private fetchBasicDashboard(): Observable<BasicDashboardInformationApiDto> {
    return this.http.get<BasicDashboardInformationApiDto>(DashboardService.BASIC_DASHBOARD_URL);
  }
}
