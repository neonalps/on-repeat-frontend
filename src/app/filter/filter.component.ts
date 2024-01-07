import { Component } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [I18nPipe],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {

}
