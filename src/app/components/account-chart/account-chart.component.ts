import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountChartApiDto } from '@src/app/models';
import { navigateToChartDetails } from '@src/app/util/router';

@Component({
  selector: 'app-account-chart',
  standalone: true,
  imports: [],
  templateUrl: './account-chart.component.html',
  styleUrl: './account-chart.component.css'
})
export class AccountChartComponent {

  @Input() accountChart!: AccountChartApiDto;

  constructor(private readonly router: Router) {}

  goToChartDetails(chartId: number, chartName: string): void {
    navigateToChartDetails(this.router, chartId, chartName);
  }

}
