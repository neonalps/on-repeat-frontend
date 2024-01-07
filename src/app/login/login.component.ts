import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment';
import { OAuthConfig } from '@src/app/models';
import { generateRandomString } from '@src/app/util/common';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [I18nPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private readonly STATE_LENGTH = 16;
  private postLoginRedirectState: string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.postLoginRedirectState = this.route.snapshot.queryParams["state"] || "";
  }

  spotifyLogin() {
    const config: OAuthConfig = environment.oauth?.spotify;
    if (!config) {
      throw new Error("Failed to read Spotify OAuth config");
    }

    const queryParams = {
      state: this.postLoginRedirectState as string,
      response_type: "code",
      client_id: config.clientId,
      scope: "user-read-private user-read-email",
      redirect_uri: config.redirectUri,
    };
    
    window.location.href = [config.authorizeUrl, "?", new URLSearchParams(queryParams).toString()].join("");
  }

}
