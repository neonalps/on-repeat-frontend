import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { navigateToTrackDetails } from '@src/app/util/router';

@Component({
  selector: 'app-account-chart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-chart-item.component.html',
  styleUrl: './account-chart-item.component.css'
})
export class AccountChartItemComponent {

  @Input() item!: ChartItem;
  @Input() hidePlace?: boolean;
  @Input() hidePlayCount?: boolean;
  @Input() notBold?: boolean;

  constructor(private readonly router: Router) {}

  getName(): string | null {
    return this.item.artists.length !== 0 ? this.item.name : null;
  }

  getArtists(): string {
    return this.item.artists.length > 0 ? this.item.artists.join(", ") : this.item.name;
  }

  getAlbum(): string | null {
    return this.item.album;
  }

  getImageUrl(): string | null {
    return this.item.imageUrl;
  }

  getPlace(): number {
    return this.item.place;
  }

  getPlayCount(): number | null {
    return this.item.playCount;
  }

  goToItem(): void {
    if (this.item.type === 'track') {
      navigateToTrackDetails(this.router, this.item.itemId, this.item.name);
    }
  }

  isPlaceVisible(): boolean {
    return this.hidePlace !== true;
  }

  isPlayCountVisible(): boolean {
    return this.hidePlayCount !== true
  }

  isBold(): boolean {
    return this.notBold !== true;
  }
}

export interface ChartItem {
  chartId: number;
  chartName: string;
  place: number;
  itemId: number;
  name: string;
  playCount: number | null;
  artists: string[];
  album: string | null;
  imageUrl: string | null;
  type: string;
}