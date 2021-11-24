import { APIError } from 'modularni-urad-utils'
import { migrateDB } from './db'
import { setup as CORSSetup } from './corsman'

async function onChanged (configs) {
  console.log(`ORGID setup: ${JSON.stringify(configs, null, 2)}`)
  ORG_CONFIGS = configs
  CORSSetup(configs)
  return migrateDB(configs)
}

let ORG_CONFIGS = null

function getOrgConfig (req) {
  req.orgconfig = ORG_CONFIGS[req.params.tenantid]
  return req.orgconfig !== undefined
}

function loadOrgConfig (req, res, next) {
  return getOrgConfig(req) 
    ? next()
    : next(new APIError(404, 'unknown tenant'))
}

export default { loadOrgConfig, onChanged }