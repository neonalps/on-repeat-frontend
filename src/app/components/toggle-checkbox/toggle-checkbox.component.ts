import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CheckboxChangeEvent {
  newChecked: boolean;
}

@Component({
  selector: 'app-toggle-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './toggle-checkbox.component.html',
  styleUrl: './toggle-checkbox.component.css'
})
export class ToggleCheckboxComponent {
  @Input() checked: boolean = false;
  @Output() readonly valueChange = new EventEmitter<CheckboxChangeEvent>();

  onChange() {
    setTimeout(() => this.valueChange.next(ToggleCheckboxComponent.createCheckboxChangeEvent(!this.checked)), 300);
  }

  private static createCheckboxChangeEvent(newChecked: boolean): CheckboxChangeEvent {  
    return { newChecked };
  } 
}
