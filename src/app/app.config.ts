import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '@src/app/app.routes';
import { provideStore } from '@ngrx/store';
import { authReducer } from '@src/app/auth/store/auth.reducer';
import { uiStateReducer } from '@src/app/ui-state/store/ui-state.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@src/app/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
    provideRouter(routes), 
    provideStore({
      auth: authReducer,
      ui: uiStateReducer,
    }),
  ],
};
 