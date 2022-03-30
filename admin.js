import axios from 'axios'
const BUILD_URL = process.env.BUILD_URL 
  || 'https://modurad.otevrenamesta.cz/adminmodules/vue-admin/dist'

export default function _initAdmin (ctx) {
  const { express } = ctx
  const api = express()
  api.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=2h')
    next()
  })

  api.get('/settings.json', (req, res, next) => {
    res.set('Content-type', 'application/json')
    res.send(JSON.stringify(req.tenantcfg.admin, null, 4))
  })

  api.get('*', async (req, res, next) => {
    const r = await axios.get(BUILD_URL + req.params[0], { 
      responseType: 'stream',
      timeout: 2000
    })
    r.data.pipe(res)
  })

  return api
}