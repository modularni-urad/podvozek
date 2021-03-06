import cors from 'cors'
import { TENANT_CONFIGS } from './configman'

// taken from https://github.com/expressjs/cors#configuring-cors-asynchronously
function configCallback (req, callback) {
  const CONF = TENANT_CONFIGS[req.params.tenantid]
  const restricted = CONF && CONF.cors !== undefined
  const allowed = !restricted || CONF.cors.indexOf(req.headers['origin']) >= 0
  // callback expects two parameters: error and options
  callback(null, { 
    origin: allowed,
    credentials: true
  })
}

export const corsMW = cors(configCallback)