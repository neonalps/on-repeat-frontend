import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '@src/app/nav/nav.component';
import { AuthService } from '@src/app/auth/auth.service';
import { ModalComponent } from '@src/app/modal/modal/modal.component';
import { ModalService } from './modal/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    CommonModule, 
    RouterOutlet,
    ModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'on-repeat-frontend';

  constructor(private readonly authService: AuthService, private readonly modalService: ModalService) {
    this.authService.init();
  }

  isModalActive(): boolean {
    return this.modalService.isActive();
  }
}
