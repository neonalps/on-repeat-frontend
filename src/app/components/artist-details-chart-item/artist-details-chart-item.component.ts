import { Component, Input } from '@angular/core';
import { ChartItem } from '../account-chart-item/account-chart-item.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { navigateToChartDetails } from '@src/app/util/router';

@Component({
  selector: 'app-artist-details-chart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-details-chart-item.component.html',
  styleUrl: './artist-details-chart-item.component.css'
})
export class ArtistDetailsChartItemComponent {

  @Input() item!: ChartItem;

  constructor(private readonly router: Router) {}

  getName(): string {
    return this.item.name;
  }

  getImageUrl(): string | null {
    return this.item.imageUrl;
  }

  getChartName(): string {
    return this.item.chartName;
  }

  getPlace(): number {
    return this.item.place;
  }

  goToItem(): void {
    navigateToChartDetails(this.router, this.item.chartId, this.item.chartName);
  }

}
