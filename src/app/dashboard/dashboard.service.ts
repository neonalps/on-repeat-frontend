import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable, first } from 'rxjs';
import { AuthUser, BasicDashboardInformationApiDto, ChartApiDto, ChartApiItem } from '@src/app/models';
import { getHeaderWithAuthorization } from '@src/app/util/http';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/store.index';
import { selectAuthUser } from '@src/app/auth/store/auth.selectors';
import { isDefined, isNotDefined } from '@src/app/util/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private static readonly BASIC_DASHBOARD_URL =`${environment.apiBaseUrl}/api/v1/dashboard`;

  private basicDashboard: BasicDashboardInformationApiDto | null = null;

  constructor(private readonly http: HttpClient, private readonly store: Store<AppState>) {
    this.store.select(selectAuthUser)
      .pipe(takeUntilDestroyed())
      .subscribe(auth => {
        if (isDefined(auth)) {
          this.fetchBasicDashboard((auth as AuthUser).accessToken)
            .pipe(first())
            .subscribe(response => {
              this.basicDashboard = response;
              console.log('got dashboard')
            });
        } else {
          this.basicDashboard = null;
        }
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

  private fetchBasicDashboard(accessToken: string): Observable<BasicDashboardInformationApiDto> {
    return this.http.get<BasicDashboardInformationApiDto>(DashboardService.BASIC_DASHBOARD_URL, getHeaderWithAuthorization(accessToken));
  }
}
