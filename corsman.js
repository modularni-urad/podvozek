import cors from 'cors'
import { TENANT_CONFIGS } from './configman'

// taken from https://github.com/expressjs/cors#configuring-cors-asynchronously
function configCallback (req, callback) {
  const CONF = TENANT_CONFIGS[req.params.tenantid]
  const allowed = CONF && 
    CONF.cors !== undefined &&
    CONF.cors.indexOf(req.headers['origin']) >= 0
  // callback expects two parameters: error and options
  callback(null, { origin: allowed })
}

export const corsMW = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()  // just forward for tests
  : cors(configCallback)