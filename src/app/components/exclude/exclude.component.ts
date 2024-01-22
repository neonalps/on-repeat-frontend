import { Component, Input } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

@Component({
  selector: 'app-exclude',
  standalone: true,
  imports: [I18nPipe],
  templateUrl: './exclude.component.html',
  styleUrl: './exclude.component.css'
})
export class ExcludeComponent {

  @Input() color: string = "#cccccc";

}
