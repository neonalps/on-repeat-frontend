import { Component, Input } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

@Component({
  selector: 'app-reload',
  standalone: true,
  imports: [I18nPipe],
  templateUrl: './reload.component.html',
  styleUrl: './reload.component.css'
})
export class ReloadComponent {
  @Input() color: string = "#ffffff";
}
