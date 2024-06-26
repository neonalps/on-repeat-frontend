import { Component, Input } from '@angular/core';
import { ChartItem } from '../account-chart-item/account-chart-item.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { navigateToTrackDetails } from '@src/app/util/router';

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

  getPlace(): number | string {
    return this.item.place === 1 ? `🏆` : this.item.place;
  }

  goToItem(): void {
    navigateToTrackDetails(this.router, this.item.itemId, this.item.name);
  }

}
