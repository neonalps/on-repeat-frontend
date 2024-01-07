import { createReducer, on } from "@ngrx/store";
import { login, logout } from "./auth.actions";
import { AuthState } from "./auth.selectors";

export const initialState: AuthState = {
    isLoggedIn: false,
    auth: null,
};

export const authReducer = createReducer(
    initialState,
    on(login, (_, { auth }) => auth),
    on(logout, () => initialState),
);