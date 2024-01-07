import { AuthState } from "@src/app/auth/store/auth.selectors";
import { UiState } from "@src/app/ui-state/store/ui-state.selectors";

export interface AppState {
    auth: AuthState,
    ui: UiState,
};