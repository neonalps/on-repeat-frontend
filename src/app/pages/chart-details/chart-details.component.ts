import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountChartItemComponent, ChartItem } from '@src/app/components/account-chart-item/account-chart-item.component';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { CheckboxChangeEvent, ToggleCheckboxComponent } from '@src/app/components/toggle-checkbox/toggle-checkbox.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AccountChartDetailsApiDto, AccountChartItemApiDto, TrackApiDto } from '@src/app/models';
import { ChartService } from '@src/app/services/chart/chart.service';
import { pickImageFromArray } from '@src/app/util/common';
import { PATH_PARAM_CHART_SLUG, parseUrlSlug } from '@src/app/util/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-chart-details',
  standalone: true,
  imports: [
    AccountChartItemComponent, 
    CommonModule, 
    I18nPipe, 
    LoadingComponent,
    ToggleCheckboxComponent,
  ],
  templateUrl: './chart-details.component.html',
  styleUrl: './chart-details.component.css'
})
export class ChartDetailsComponent implements OnInit {

  isLoading: boolean = false;
  areSpoilersEnabled: boolean = false;

  private chart: AccountChartDetailsApiDto<unknown> | null = null;
  private items: ChartItem[] = [];

  constructor(private readonly chartService: ChartService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const chartId = parseUrlSlug(this.route.snapshot.paramMap.get(PATH_PARAM_CHART_SLUG) as string);

    this.isLoading = true;
    this.chartService.fetchAccountChartDetails(chartId)
      .pipe(
        take(1)
      ).subscribe({
        next: response => {
          this.chart = response;
          this.items = this.processResponse(response);
          this.isLoading = false;
        },
        error: error => {
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  getTitle(): string | undefined {
    return this.chart?.accountChart.name;
  }

  getItems(): ChartItem[] {
    return this.items.sort(this.areSpoilersEnabled ? this.getAscendingSortComparator : this.getDescendingSortComparator);
  }

  onToggleChange(event: CheckboxChangeEvent) {
    this.areSpoilersEnabled = event.newChecked;
  }

  toggleCheckbox(): void {
    this.areSpoilersEnabled = !this.areSpoilersEnabled;
  }
  
  private processResponse(response: AccountChartDetailsApiDto<unknown>): ChartItem[] {
    if (!response || response.items.length === 0) {
      return [];
    }

    const chartType = response.accountChart.type;
    switch (chartType) {
      case "track":
        return this.processTrackCharts(response.items as AccountChartItemApiDto<TrackApiDto>[]);
      default:
        console.warn(`Unknown chart type ${chartType}`);
        return [];
    }
  }

  private processTrackCharts(items: AccountChartItemApiDto<TrackApiDto>[]): ChartItem[] {
    return items.map(item => {
      const image = pickImageFromArray(item.item.album?.images, 'small');

      return {
        itemId: item.item.id,
        name: item.item.name,
        place: item.place,
        playCount: item.playCount,
        artists: item.item.artists.map(artist => artist.name),
        album: item.item.album !== null ? item.item.album.name : null,
        imageUrl: image !== null ? image.url : null,
        type: 'track',
      }
    })
  }

  private getAscendingSortComparator(a: ChartItem, b: ChartItem): number {
    if (a.place < b.place) {
      return -1;
    } else if (a.place > b.place) {
      return 1;
    } else {
      return 0;
    }
  }

  private getDescendingSortComparator(a: ChartItem, b: ChartItem): number {
    if (a.place < b.place) {
      return 1;
    } else if (a.place > b.place) {
      return -1;
    } else {
      return 0;
    }
  }

}
