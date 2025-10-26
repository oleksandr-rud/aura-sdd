import { buildServer } from "./app"

const app = buildServer()

async function start() {
  try {
    await app.ready()
    const { API_PORT, API_HOST } = app.config

    await app.listen({
      port: API_PORT,
      host: API_HOST,
    })

    app.log.info(`API listening on http://${API_HOST}:${API_PORT}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()
