import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@src/app/services/dashboard/dashboard.service';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '@src/app/components/divider/divider.component';
import { navigateToArtistDetails, navigateToTrackDetails } from '@src/app/util/router';
import { Router } from '@angular/router';
import { AccountChartItemComponent, ChartItem } from '@src/app/components/account-chart-item/account-chart-item.component';

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

  constructor(private readonly dashboardService: DashboardService, private readonly router: Router) {}

  ngOnInit(): void {
    this.dashboardService.load();
  }

  isLoading(): boolean {
    return this.dashboardService.getCurrentTrackCharts() !== null;
  }

  getCurrentTrackCharts(): ChartItem[] {
    return this.dashboardService.getCurrentTrackCharts();
  }

  getCurrentArtistCharts(): ChartItem[] {
    return this.dashboardService.getCurrentArtistCharts();
  }

  getAllTimeTrackCharts(): ChartItem[] {
    return this.dashboardService.getAllTimeTrackCharts();
  }

  getAllTimeArtistCharts(): ChartItem[] {
    return this.dashboardService.getAllTimeArtistCharts();
  }

  goToArtist(artistId: number, artistName: string): void {
    navigateToArtistDetails(this.router, artistId, artistName);
  }

  goToTrack(trackId: number, trackName: string): void {
    navigateToTrackDetails(this.router, trackId, trackName);
  }

}
