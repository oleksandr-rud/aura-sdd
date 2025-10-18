import "./index.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectSidebarExpanded, selectTheme } from "./features/ui/uiSelectors";
import { toggleSidebar, toggleTheme } from "./features/ui/uiSlice";
import { config } from "./config";

export function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const sidebarExpanded = useAppSelector(selectSidebarExpanded);

  return (
    <div className={`app-shell ${theme}`}>
      <aside className={`sidebar ${sidebarExpanded ? "open" : ""}`}>
        <h1>Spec Gen Client</h1>
        <button type="button" onClick={() => dispatch(toggleSidebar())}>
          {sidebarExpanded ? "Collapse" : "Expand"} Sidebar
        </button>
      </aside>
      <main>
        <header>
          <button type="button" onClick={() => dispatch(toggleTheme())}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </header>
        <section>
          <h2>Rapid spec-driven delivery</h2>
          <p>
            This React + Vite shell is wired with Redux Toolkit so product
            squads can plug features into a consistent state layer without
            retooling the monorepo.
          </p>
          <p className="hint">
            API base URL: <code>{config.apiBaseUrl}</code>
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
