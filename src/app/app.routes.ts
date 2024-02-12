import { Routes } from '@angular/router';
import { LoginComponent } from '@src/app/login/login.component';
import { OauthSpotifyComponent } from '@src/app/oauth/spotify/oauth.spotify.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { loggedInGuard } from '@src/app/auth/guards/loggedin.guard';
import { RecentlyPlayedComponent } from '@src/app/recently-played/recently-played.component';
import { ProfileComponent } from '@src/app/pages/profile/profile.component';
import { TrackDetailsComponent } from '@src/app/pages/track-details/track-details.component';
import { PATH_PARAM_ARTIST_SLUG, PATH_PARAM_CHART_PERIOD_SLUG, PATH_PARAM_CHART_SLUG, PATH_PARAM_CHART_TYPE, PATH_PARAM_TRACK_SLUG } from '@src/app/util/router';
import { ArtistDetailsComponent } from '@src/app/pages/artist-details/artist-details.component';
import { ChartComponent } from '@src/app/pages/chart/chart.component';
import { ChartDetailsComponent } from '@src/app/pages/chart-details/chart-details.component';
import { ChartPeriodComponent } from '@src/app/pages/chart-period/chart-period.component';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: 'charts', 
        component: ChartComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `charts/period/:${PATH_PARAM_CHART_TYPE}/:${PATH_PARAM_CHART_PERIOD_SLUG}`, 
        component: ChartPeriodComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `charts/:${PATH_PARAM_CHART_SLUG}`, 
        component: ChartDetailsComponent,
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
        path: 'profile', 
        component: ProfileComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: 'recently-played', 
        component: RecentlyPlayedComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `tracks/:${PATH_PARAM_TRACK_SLUG}`, 
        component: TrackDetailsComponent,
        canActivate: [loggedInGuard],
    },
    { 
        path: `artists/:${PATH_PARAM_ARTIST_SLUG}`, 
        component: ArtistDetailsComponent,
        canActivate: [loggedInGuard],
    },
];
