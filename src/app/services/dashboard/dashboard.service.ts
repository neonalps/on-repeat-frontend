import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable, take } from 'rxjs';
import { AccountChartItemApiDto, ArtistApiDto, BasicDashboardInformationApiDto, TrackApiDto } from '@src/app/models';
import { isNotDefined, pickImageFromArray } from '@src/app/util/common';
import { ChartItem } from '@src/app/components/account-chart-item/account-chart-item.component';

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

  getCurrentTrackCharts(): ChartItem[] {
    if (isNotDefined(this.basicDashboard)) {
      return [];
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.tracks.current.items.map(item => this.mapTrackToChartItem(item));
  }

  getCurrentArtistCharts(): ChartItem[] {
    if (isNotDefined(this.basicDashboard)) {
      return [];
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.artists.current.items.map(item => this.mapArtistToChartItem(item));
  }
  
  getAllTimeTrackCharts(): ChartItem[] {
    if (isNotDefined(this.basicDashboard)) {
      return [];
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.tracks.allTime.items.map(item => this.mapTrackToChartItem(item));
  }

  getAllTimeArtistCharts(): ChartItem[] {
    if (isNotDefined(this.basicDashboard)) {
      return [];
    }

    return (this.basicDashboard as BasicDashboardInformationApiDto).charts.artists.allTime.items.map(item => this.mapArtistToChartItem(item));
  }

  private fetchBasicDashboard(): Observable<BasicDashboardInformationApiDto> {
    return this.http.get<BasicDashboardInformationApiDto>(DashboardService.BASIC_DASHBOARD_URL);
  }

  private mapTrackToChartItem(item: AccountChartItemApiDto<unknown>): ChartItem {
    const track = item as AccountChartItemApiDto<TrackApiDto>;

    return {
      chartId: 0,
      chartName: "",
      place: item.place,
      itemId: track.item.id,
      name: track.item.name,
      artists: track.item.artists.map(artist => artist.name),
      album: track.item.album?.name || null,
      imageUrl: pickImageFromArray(track.item.album?.images, "small")?.url || null,
      playCount: item.playCount,
      type: 'track',
    };
  }

  private mapArtistToChartItem(item: AccountChartItemApiDto<unknown>): ChartItem {
    const artist = item as AccountChartItemApiDto<ArtistApiDto>;

    return {
      chartId: 0,
      chartName: "",
      place: item.place,
      itemId: artist.item.id,
      name: artist.item.name,
      artists: [],
      album: null,
      imageUrl: pickImageFromArray(artist.item.images, "small")?.url || null,
      playCount: item.playCount,
      type: 'artist',
    };
  }
}
