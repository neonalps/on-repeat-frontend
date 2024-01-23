import { createAction, props } from "@ngrx/store";
import { AuthState } from "./auth.selectors";

export interface UpdateAuthTokensAction {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}

export const login = createAction('[Auth] Login', props<{auth: AuthState}>());
export const logout = createAction('[Auth] Logout');
export const updateAuthTokens = createAction('[Auth] Update auth tokens', props<UpdateAuthTokensAction>());