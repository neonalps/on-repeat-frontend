import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@src/app/services/dashboard/dashboard.service';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { ChartItem, ChartItemComponent } from '@src/app/components/chart-item/chart-item.component';
import { isNotDefined } from '@src/app/util/common';
import { ChartApiDto, ChartArtistApiDto, ChartTrackApiDto } from '@src/app/models';
import { DividerComponent } from '@src/app/components/divider/divider.component';
import { convertChartArtistApiDtoToChartItem, convertChartTrackApiDtoToChartItem } from '@src/app/util/converter';
import { navigateToArtistDetails, navigateToTrackDetails } from '@src/app/util/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartItemComponent, 
    CommonModule, 
    DividerComponent,
    I18nPipe, 
    LoadingComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private readonly dashboardService: DashboardService, private readonly router: Router) {}

  ngOnInit(): void {
    this.dashboardService.load();
  }

  isLoading(): boolean {
    return this.dashboardService.getCurrentTrackCharts() !== null;
  }

  getCurrentTrackCharts(): ChartItem[] {
    const currentTrackCharts = this.dashboardService.getCurrentTrackCharts();
    if (isNotDefined(currentTrackCharts)) {
      return [];
    }

    return (currentTrackCharts as ChartApiDto<ChartTrackApiDto>).items.map(item => convertChartTrackApiDtoToChartItem(item));
  }

  getCurrentArtistCharts(): ChartItem[] {
    const currentArtistCharts = this.dashboardService.getCurrentArtistCharts();
    if (isNotDefined(currentArtistCharts)) {
      return [];
    }

    return (currentArtistCharts as ChartApiDto<ChartArtistApiDto>).items.map(item => convertChartArtistApiDtoToChartItem(item));
  }

  getAllTimeTrackCharts(): ChartItem[] {
    const allTimeTrackCharts = this.dashboardService.getAllTimeTrackCharts();
    if (isNotDefined(allTimeTrackCharts)) {
      return [];
    }

    return (allTimeTrackCharts as ChartApiDto<ChartTrackApiDto>).items.map(item => convertChartTrackApiDtoToChartItem(item));
  }

  getAllTimeArtistCharts(): ChartItem[] {
    const allTimeArtistCharts = this.dashboardService.getAllTimeArtistCharts();
    if (isNotDefined(allTimeArtistCharts)) {
      return [];
    }

    return (allTimeArtistCharts as ChartApiDto<ChartArtistApiDto>).items.map(item => convertChartArtistApiDtoToChartItem(item));
  }

  goToArtist(artistId: number): void {
    navigateToArtistDetails(this.router, artistId);
  }

  goToTrack(trackId: number): void {
    navigateToTrackDetails(this.router, trackId);
  }

}
