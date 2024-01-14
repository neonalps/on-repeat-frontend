import { Component, Input } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

@Component({
  selector: 'app-close',
  standalone: true,
  imports: [I18nPipe],
  templateUrl: './close.component.html',
  styleUrl: './close.component.css'
})
export class CloseComponent {
  @Input() color: string = "#000000";
}
