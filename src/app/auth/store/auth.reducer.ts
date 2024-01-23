import { createReducer, on } from "@ngrx/store";
import { UpdateAuthTokensAction, login, logout, updateAuthTokens } from "./auth.actions";
import { AuthState } from "./auth.selectors";

export const initialState: AuthState = {
    isLoggedIn: false,
    auth: null,
};

export const authReducer = createReducer(
    initialState,
    on(login, (_, { auth }) => auth),
    on(logout, () => initialState),
    on(updateAuthTokens, (state: AuthState, payload: UpdateAuthTokensAction): AuthState => {
        if (state.auth === null) {
            return initialState;
        }

        return {
            isLoggedIn: true,
            auth: {
                ...state.auth,
                accessToken: payload.accessToken,
                accessTokenExpiresAt: payload.accessTokenExpiresAt,
                refreshToken: payload.refreshToken,
                refreshTokenExpiresAt: payload.refreshTokenExpiresAt,
            },
        }
    }),
);