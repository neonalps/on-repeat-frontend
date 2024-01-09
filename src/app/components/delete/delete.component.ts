import { Component } from '@angular/core';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [I18nPipe],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {

}
