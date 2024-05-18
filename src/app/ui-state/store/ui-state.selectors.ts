import { createSelector } from "@ngrx/store";
import { AppState } from "@src/app/store.index";

export interface UiState {
    menuVisible: boolean;
    searchVisible: boolean;
}

export const selectUiState = (state: AppState) => state.ui;

export const selectMenuVisible = createSelector(
    selectUiState,
    (state: UiState) => state.menuVisible,
);

export const selectSearchVisible = createSelector(
    selectUiState,
    (state: UiState) => state.searchVisible,
);