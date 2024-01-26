import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

export interface ChartItem {
  itemId: number;
  name: string;
  artists: string[] | null;
  imageUrl: string;
  count: number;
  href: string;
}

@Component({
  selector: 'app-chart-item',
  standalone: true,
  imports: [CommonModule, I18nPipe],
  templateUrl: './chart-item.component.html',
  styleUrl: './chart-item.component.css'
})
export class ChartItemComponent {

  @Input() chartItem!: ChartItem;
  @Input() countVisible: boolean = true;

  constructor() {}

  getName(): string {
    return this.chartItem.name;
  }

  getArtists(): string | null {
    return this.chartItem.artists === null ? null : this.chartItem.artists.join(", ");
  }

  getCount(): number | null {
    return this.countVisible === true ? this.chartItem.count : null;
  }

  getImageUrl(): string | undefined {
    return this.chartItem.imageUrl;
  }

  getHref(): string {
    return this.chartItem.href;
  }
}
