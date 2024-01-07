import { createReducer, on } from "@ngrx/store";
import { UiState } from "./ui-state.selectors";
import { hideMenu, showMenu, toggleMenu } from "./ui-state.actions";

export const initialState: UiState = {
    menuVisible: false,
};

export const uiStateReducer = createReducer(
    initialState,
    on(showMenu, () => {
        return {
            menuVisible: true,
        };
    }),
    on(hideMenu, () => {
        return {
            menuVisible: false,
        };
    }),
    on(toggleMenu, (state: UiState) => {
        return {
            menuVisible: !state.menuVisible
        };
    }),
);