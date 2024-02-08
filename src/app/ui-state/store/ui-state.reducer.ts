import { createReducer, on } from "@ngrx/store";
import { UiState } from "./ui-state.selectors";
import { hideMenu, hideSearch, showMenu, showSearch, toggleMenu, toggleSearch } from "./ui-state.actions";

export const initialState: UiState = {
    menuVisible: false,
    searchVisible: false,
};

export const uiStateReducer = createReducer(
    initialState,
    on(showMenu, () => {
        return {
            menuVisible: true,
            searchVisible: false,
        };
    }),
    on(hideMenu, () => {
        return {
            menuVisible: false,
            searchVisible: false,
        };
    }),
    on(toggleMenu, (state: UiState) => {
        return {
            menuVisible: !state.menuVisible,
            searchVisible: state.searchVisible,
        };
    }),
    on(showSearch, () => {
        return {
            menuVisible: false,
            searchVisible: true,
        };
    }),
    on(hideSearch, () => {
        return {
            menuVisible: false,
            searchVisible: false,
        };
    }),
    on(toggleSearch, (state: UiState) => {
        return {
            menuVisible: state.menuVisible,
            searchVisible: !state.searchVisible,
        };
    }),
);