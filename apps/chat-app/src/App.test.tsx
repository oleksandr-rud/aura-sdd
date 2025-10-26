import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, expect, it } from "vitest"
import App from "./App"
import { store } from "./app/store"

describe("App shell", () => {
  it("renders the headline", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(
      screen.getByRole("heading", {
        name: /rapid spec-driven delivery/i,
      })
    ).toBeInTheDocument()
  })
})
