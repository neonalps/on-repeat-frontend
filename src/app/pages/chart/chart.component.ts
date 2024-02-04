import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountChartComponent } from '@src/app/components/account-chart/account-chart.component';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AccountChartApiDto } from '@src/app/models';
import { ChartService } from '@src/app/services/chart/chart.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    AccountChartComponent, 
    CommonModule, 
    I18nPipe, 
    LoadingComponent
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {

  isLoading: boolean = false;
  charts: AccountChartApiDto[] = [];
  nextPageKey?: string;

  constructor(private readonly chartService: ChartService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.chartService.fetchAccountCharts(this.nextPageKey)
      .pipe(
        take(1)
      ).subscribe({
        next: response => {
          this.charts = response.items;
          this.nextPageKey = response.nextPageKey;
          this.isLoading = false;
        },
        error: error => {
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  addChart(): void {

  }

}
