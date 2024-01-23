import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './toggle-checkbox.component.html',
  styleUrl: './toggle-checkbox.component.css'
})
export class ToggleCheckboxComponent {
  @Input() checked: boolean = false;
}
