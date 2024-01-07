import { Routes } from '@angular/router';
import { LoginComponent } from '@src/app/login/login.component';
import { OauthSpotifyComponent } from '@src/app/oauth/spotify/oauth.spotify.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { loggedInGuard } from '@src/app/auth/guards/loggedin.guard';
import { RecentlyPlayedComponent } from '@src/app/recently-played/recently-played.component';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: 'login', 
        component: LoginComponent,
    },
    {
         path: 'oauth/spotify', 
         component: OauthSpotifyComponent,
    },
    { 
        path: 'recently-played', 
        component: RecentlyPlayedComponent,
        canActivate: [loggedInGuard],
    },
];
