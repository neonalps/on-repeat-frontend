import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccountChartComponent } from '@src/app/components/account-chart/account-chart.component';
import { GeneratedComponent } from '@src/app/components/chart/generated/generated.component';
import { PersonalComponent } from '@src/app/components/chart/personal/personal.component';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    AccountChartComponent,
    CommonModule, 
    I18nPipe, 
    LoadingComponent,
    GeneratedComponent,
    PersonalComponent,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {

    private selectedChart: "generated" | "personal" = "generated";

    selectGenerated(): void {
      this.selectedChart = "generated";
    }

    selectPersonal(): void {
      this.selectedChart = "personal";
    }

    getSelectedChart(): string {
      return this.selectedChart;
    }

}
