import cors from 'cors'

export function setup (configs) {
  CONFIGS = configs
}

let CONFIGS = []

// taken from https://github.com/expressjs/cors#configuring-cors-asynchronously
function configCallback (req, callback) {
  const CONF = CONFIGS[req.params.tenantid]
  const allowed = CONF && 
    CONF.cors !== undefined && 
    CONF.cors.indexOf(req.headers['origin']) >= 0
  // callback expects two parameters: error and options
  callback(null, { origin: allowed })
}

export const corsMW = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()  // just forward for tests
  : cors(configCallback)