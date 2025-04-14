import { Component, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '@src/app/nav/nav.component';
import { AuthService } from '@src/app/auth/auth.service';
import { ModalComponent } from '@src/app/modal/modal/modal.component';
import { ModalService } from './modal/modal.service';
import { AppState } from './store.index';
import { Store } from '@ngrx/store';
import { selectMenuVisible } from './ui-state/store/ui-state.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toggleSearch } from './ui-state/store/ui-state.actions';

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

  private menuActive: boolean = false;

  constructor(
    private readonly authService: AuthService, 
    private readonly modalService: ModalService,
    private readonly store: Store<AppState>,
  ) {
    this.authService.init();

    this.store.select(selectMenuVisible)
      .pipe(takeUntilDestroyed())
      .subscribe(menuActive => this.menuActive = menuActive);
  }

  isMenuActive(): boolean {
    return this.menuActive;
  }

  isModalActive(): boolean {
    return this.modalService.isActive();
  }

  @HostListener('document:keypress.alt.f')
  handleSearchKeyEvent() {
    this.store.dispatch(toggleSearch());
  }
}
