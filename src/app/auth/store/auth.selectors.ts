import { createSelector } from "@ngrx/store";
import { AuthUser } from "@src/app/models";
import { AppState } from "@src/app/store.index";

export interface AuthState {
    isLoggedIn: boolean;
    auth: AuthUser | null;
};

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthUser = createSelector(
    selectAuth,
    (state: AuthState) => state.isLoggedIn === true ? state.auth : null,
);