import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { buildServer } from "../app"

describe("health routes", () => {
  const app = buildServer()

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("returns ok status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      status: "ok",
    })
  })
})
