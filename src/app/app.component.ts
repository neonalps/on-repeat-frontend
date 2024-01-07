import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '@src/app/nav/nav.component';
import { AuthService } from '@src/app/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    CommonModule, 
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'on-repeat-frontend';

  constructor(private readonly authService: AuthService) {
    this.authService.init();
  }
}
