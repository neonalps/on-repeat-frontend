import { createAction, props } from "@ngrx/store";
import { AuthState } from "./auth.selectors";

export const login = createAction('[Auth] Login', props<{auth: AuthState}>());
export const logout = createAction('[Auth] Logout');