import path from 'path'
import cleanupDB from './dbcleanup'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')
process.env.NODE_ENV = 'test'
process.env.SESSION_SERVICE_PORT = 24000
process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
process.env.CONFIG_FOLDER = path.join(__dirname, '../configs')

module.exports = function (g) {
  const port = process.env.PORT || 3333
  Object.assign(g, {
    port,
    url: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: []
  })
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)

  g.InitApp = async function (initFn) {
    const app = await initFn()
    return new Promise((resolve, reject) => {
      g.server = app.listen(g.port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        setTimeout(resolve, 1900)
      })
    })
  }

  g.close = async function() {
    await cleanupDB()
    g.server.close()
    g.sessionSrvcMock.close()
  }
}