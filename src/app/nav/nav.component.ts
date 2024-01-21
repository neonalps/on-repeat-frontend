import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectMenuVisible } from '@src/app/ui-state/store/ui-state.selectors';
import { AppState } from '@src/app/store.index';
import { hideMenu, toggleMenu } from '@src/app/ui-state/store/ui-state.actions';
import { AppLogoComponent } from '@src/app/app-logo/app-logo.component';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { selectAuthUser } from '@src/app/auth/store/auth.selectors';
import { AuthUser } from '@src/app/models';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AuthService } from '@src/app/auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    AppLogoComponent,
    CommonModule,
    I18nPipe,
    RouterModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  menuVisible$ = this.store.select(selectMenuVisible);
  user: AuthUser | null = null;

  constructor(private readonly authService: AuthService, private readonly router: Router, private readonly store: Store<AppState>) {
    this.store.select(selectAuthUser)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.user = value;
      });

    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          this.hideMenu();
        }
      });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  hideMenu() {
    this.store.dispatch(hideMenu());
  }

  logout() {
    this.toggle();
    this.authService.signOut();
  }

  toggle() {
    this.store.dispatch(toggleMenu());
  }

}
