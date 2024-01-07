import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-app-logo',
  standalone: true,
  imports: [],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.css'
})
export class AppLogoComponent {
  color: string = "white"

  @Input() top: number = 0;
  @Input() width: number = 32;
}
