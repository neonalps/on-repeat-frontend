import { createAction } from "@ngrx/store";

export const toggleMenu = createAction('[UI State] Toggle menu');
export const showMenu = createAction('[UI State] Show menu');
export const hideMenu = createAction('[UI State] Hide menu');