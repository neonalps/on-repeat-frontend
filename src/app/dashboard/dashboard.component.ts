import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@src/app/services/dashboard/dashboard.service';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '@src/app/components/divider/divider.component';
import { navigateToArtistDetails, navigateToTrackDetails } from '@src/app/util/router';
import { Router } from '@angular/router';
import { AccountChartItemComponent, ChartItem } from '@src/app/components/account-chart-item/account-chart-item.component';
import { AccountChartItemApiDto, ArtistApiDto, TrackApiDto } from '@src/app/models';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { pickImageFromArray } from '@src/app/util/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AccountChartItemComponent,
    CommonModule, 
    DividerComponent,
    I18nPipe, 
    LoadingComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  isLoading = false;

  private currentTrackCharts: ChartItem[] = [];
  private currentArtistCharts: ChartItem[] = [];
  private allTimeTrackCharts: ChartItem[] = [];
  private allTimeArtistCharts: ChartItem[] = [];

  constructor(private readonly dashboardService: DashboardService, private readonly router: Router) {}

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.isLoading = true;

    this.dashboardService.getDashboard()
      .pipe(take(1))
      .subscribe({
        next: (basicDashboard) => {
          this.currentTrackCharts = basicDashboard.charts.tracks.current.items.map(item => this.mapTrackToChartItem(item));
          this.allTimeTrackCharts = basicDashboard.charts.tracks.allTime.items.map(item => this.mapTrackToChartItem(item));
          this.currentArtistCharts = basicDashboard.charts.artists.current.items.map(item => this.mapArtistToChartItem(item));
          this.allTimeTrackCharts = basicDashboard.charts.artists.allTime.items.map(item => this.mapArtistToChartItem(item));
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading = false;
        } 
      });
  }

  getCurrentTrackCharts(): ChartItem[] {
    return this.currentTrackCharts;
  }

  getCurrentArtistCharts(): ChartItem[] {
    return this.currentArtistCharts;
  }

  getAllTimeTrackCharts(): ChartItem[] {
    return this.allTimeTrackCharts;
  }

  getAllTimeArtistCharts(): ChartItem[] {
    return this.allTimeArtistCharts;
  }

  goToArtist(artistId: number, artistName: string): void {
    navigateToArtistDetails(this.router, artistId, artistName);
  }

  goToTrack(trackId: number, trackName: string): void {
    navigateToTrackDetails(this.router, trackId, trackName);
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
