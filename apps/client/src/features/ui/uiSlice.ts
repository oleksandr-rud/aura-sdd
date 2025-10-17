import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

interface UIState {
  theme: Theme;
  sidebarExpanded: boolean;
}

const initialState: UIState = {
  theme: "light",
  sidebarExpanded: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarExpanded = !state.sidebarExpanded;
    }
  }
});

export const { toggleTheme, setTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
