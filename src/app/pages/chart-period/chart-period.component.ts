import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountChartItemComponent, ChartItem } from '@src/app/components/account-chart-item/account-chart-item.component';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { AccountChartItemApiDto, ArtistApiDto, ChartApiDto, TrackApiDto } from '@src/app/models';
import { ChartService } from '@src/app/services/chart/chart.service';
import { hideSearch } from '@src/app/ui-state/store/ui-state.actions';
import { hasText, pickImageFromArray } from '@src/app/util/common';
import { getUnixTimestampFromDate } from '@src/app/util/date';
import { PATH_PARAM_CHART_PERIOD_SLUG, PATH_PARAM_CHART_TYPE } from '@src/app/util/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-chart-period',
  standalone: true,
  imports: [
    AccountChartItemComponent, 
    CommonModule, 
    LoadingComponent, 
  ],
  templateUrl: './chart-period.component.html',
  styleUrl: './chart-period.component.css'
})
export class ChartPeriodComponent {

  isLoading: boolean = false;

  private chartItems: ChartItem[] = [];
  private title?: string;

  constructor(
    private readonly chartService: ChartService,
    private readonly route: ActivatedRoute,
    private readonly router: Router, 
    private readonly store: Store) {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          this.chartItems = [];

          this.loadChartPeriodDetails();
        } else if (value instanceof NavigationSkipped) {
          this.store.dispatch(hideSearch());
        }
      });
  }

  getChartItems(): ChartItem[] {
    return this.chartItems;
  }

  getTitle(): string {
    return `🗓️ ${this.title || ""}`;
  }

  private loadChartPeriodDetails() {
    const chartType = this.route.snapshot.paramMap.get(PATH_PARAM_CHART_TYPE) as string;
    const period = this.route.snapshot.paramMap.get(PATH_PARAM_CHART_PERIOD_SLUG) as string;
    this.isLoading = true;

    const [from, to, limit, title] = this.parsePeriod(period);
    this.title = title;

    this.chartService.fetchAccountAdHocCharts(chartType, from, to, limit)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.chartItems = this.convertResponse(response.type, response.items);
          this.isLoading = false;
        },
        error: error => {
          console.error(error);
          this.isLoading = false;
        }
      })
  }

  private parsePeriod(period: string): [number, number, number, string] {
    if (!hasText(period)) {
      return [
        getUnixTimestampFromDate(new Date("1970-01-01T00:00:00.000Z")),
        getUnixTimestampFromDate(new Date("2070-01-01T00:00:00.000Z")),
        100,
        "All-time",
      ];
    }

    const periodParts = period.split("-");

    switch (periodParts.length) {
      case 1:
        return this.buildYearPeriod(periodParts[0]);
      case 2:
        return this.buildMonthPeriod(periodParts[0], periodParts[1]);
      case 3:
        return this.buildDayPeriod(periodParts[0], periodParts[1], periodParts[2]);
      default:
        throw new Error(`Illegal period format`);
    }
  }

  private buildYearPeriod(year: string): [number, number, number, string] {
    const fromPattern = "YYYY-01-01T00:00:00.000Z".replace("YYYY", year);
    const fromDate = new Date(fromPattern);
    
    const toDate = new Date(fromDate);
    toDate.setFullYear(toDate.getFullYear() + 1);

    const from: number = getUnixTimestampFromDate(new Date(fromPattern));
    const to: number = getUnixTimestampFromDate(new Date(toDate.getTime() - 1));
  
    return [from, to, 50, year];
  }

  private buildMonthPeriod(year: string, month: string): [number, number, number, string] {
    const fromPattern = "YYYY-MM-01T00:00:00.000Z"
      .replace("YYYY", year)
      .replace("MM", month.padStart(2, '0'));

    const fromDate = new Date(fromPattern);
    
    const toDate = new Date(fromDate);
    toDate.setMonth(toDate.getMonth() + 1);

    const from: number = getUnixTimestampFromDate(new Date(fromPattern));
    const to: number = getUnixTimestampFromDate(new Date(toDate.getTime() - 1));

    const title = `${fromDate.toLocaleString('default', { month: 'long' })} ${year}`;
  
    return [from, to, 20, title];
  }

  private buildDayPeriod(year: string, month: string, day: string): [number, number, number, string] {
    const fromPattern = "YYYY-MM-DDT00:00:00.000Z"
      .replace("YYYY", year)
      .replace("MM", month.padStart(2, '0'))
      .replace("DD", day.padStart(2, "0"));

    const fromDate = new Date(fromPattern);
    
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 1);

    const from: number = getUnixTimestampFromDate(new Date(fromPattern));
    const to: number = getUnixTimestampFromDate(new Date(toDate.getTime() - 1));
  
    return [from, to, 10, fromDate.toLocaleDateString()];
  }

  private convertResponse(type: string, items: AccountChartItemApiDto<unknown>[]): ChartItem[] {
    switch (type) {
      case "track":
        return this.convertTrackResponse(items as AccountChartItemApiDto<TrackApiDto>[]);
      case "artist":
        return this.convertArtistResponse(items as AccountChartItemApiDto<ArtistApiDto>[]);
      default:
        console.warn(`No handler defined for chart type ${type}`);
        return [];
    }
  }

  private convertTrackResponse(items: AccountChartItemApiDto<TrackApiDto>[]): ChartItem[] {
    return items.map(item => {
      const image = pickImageFromArray(item.item.album?.images, "small");
      
      return {
        chartId: 0,
        chartName: "",
        itemId: item.item.id,
        name: item.item.name,
        place: item.place,
        playCount: item.playCount,
        artists: item.item.artists.map(artist => artist.name),
        imageUrl: image !== null ? image.url : null,
        album: null,
        type: "track",
      }
    });
  }

  private convertArtistResponse(items: AccountChartItemApiDto<ArtistApiDto>[]): ChartItem[] {
    return items.map(item => {
      const image = pickImageFromArray(item.item.images, "small");
      
      return {
        chartId: 0,
        chartName: "",
        itemId: item.item.id,
        name: item.item.name,
        place: item.place,
        playCount: item.playCount,
        artists: [],
        imageUrl: image !== null ? image.url : null,
        album: null,
        type: "artist",
      }
    })
  }

}
