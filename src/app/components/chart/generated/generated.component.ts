import { Component, OnInit } from '@angular/core';
import { AccountChartComponent } from '@src/app/components/account-chart/account-chart.component';
import { CommonModule } from '@angular/common';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { ChartService } from '@src/app/services/chart/chart.service';
import { take } from 'rxjs';
import { GeneratedChartApiDto } from '@src/app/models';
import { navigateToAdHocChartDetails } from '@src/app/util/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-generated',
  standalone: true,
  imports: [
    AccountChartComponent, 
    CommonModule,
    I18nPipe, 
    LoadingComponent,
  ],
  templateUrl: './generated.component.html',
  styleUrl: './generated.component.css'
})
export class GeneratedComponent implements OnInit {

  isLoading: boolean = false;
  charts: GeneratedChartApiDto[] = [];

  constructor(private readonly chartService: ChartService, private readonly router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.chartService.fetchGeneratedCharts()
      .pipe(
        take(1)
      ).subscribe({
        next: response => {
          this.charts = response.items;
          this.isLoading = false;
        },
        error: error => {
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  goToChartDetails(chart: GeneratedChartApiDto): void {
    navigateToAdHocChartDetails(this.router, chart.type, chart.year, chart.month);
  }

}
