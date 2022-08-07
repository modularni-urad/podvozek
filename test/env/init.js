import path from 'path'
import { fileURLToPath } from 'url'
import SessionServiceMock from 'modularni-urad-utils/test/mocks/sessionService.js'
import cleanupDB from './dbcleanup.js'
const port = process.env.PORT || 3333
process.env.NODE_ENV = 'test'
process.env.SESSION_SERVICE_PORT = 24000
process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.CONFIG_FOLDER = path.join(__dirname, '../configs')
process.env.WEBDATA_FOLDER = '/tmp'
process.env.SMTP_CONN = 'smtp://localhost'
process.env.FILESTORAGE_ACCESS_TOKEN_URL=`http://localhost:${port}/{{TENANTID}}/mediaman`
process.env.TRUSTED_IPS='127.0.0.1'
process.env.SURVEY_API=`http://localhost:${port}/{{TENANTID}}/ankety/`
process.env.FILESTORAGE_URL='https://files.vxk.cz'

export default function (g) {  
  Object.assign(g, {
    port,
    url: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: [],
    sentmails: []
  })
  g.sessionSrvcMock = SessionServiceMock(process.env.SESSION_SERVICE_PORT, g)
  
  g.InitApp = async function (initFn) {
    const app = await initFn()
    // await cleanupDB()
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
