import type { RootState } from "../../app/store"

export const selectTheme = (state: RootState) => state.ui.theme
export const selectSidebarExpanded = (state: RootState) => state.ui.sidebarExpanded
