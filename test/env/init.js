import path from 'path'
const port = process.env.PORT || 3333
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')
process.env.NODE_ENV = 'test'
process.env.SESSION_SERVICE_PORT = 24000
process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
process.env.CONFIG_FOLDER = path.join(__dirname, '../configs')
process.env.WEBDATA_FOLDER = '/tmp'
process.env.SMTP_CONN = 'smtp://localhost'
process.env.FILESTORAGE_ACCESS_TOKEN_URL=`http://localhost:${port}/{{TENANTID}}/mediaman`
process.env.TRUSTED_IPS='127.0.0.1'
process.env.FILESTORAGE_URL='https://files.vxk.cz'

module.exports = function (g) {  
  Object.assign(g, {
    port,
    url: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: [],
    sentmails: []
  })
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  g.require = function(name) {
    try {
      return require(name)
    } catch (err) {
      console.error(err)
    }    
  }
  
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
    const cleanupDB = require('./dbcleanup').default
    await cleanupDB()
    g.server.close()
    g.sessionSrvcMock.close()
  }
}
