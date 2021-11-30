import { APIError } from 'modularni-urad-utils'
import GetConfigWatcher from 'modularni-urad-utils/configloader'
import { migrateDB } from './db'
import { setup as CORSSetup } from './corsman'

const TENANT_CONFIGS = {}

function _update (configs) {
  Object.keys(TENANT_CONFIGS).map(i => delete TENANT_CONFIGS[i])
  Object.assign(TENANT_CONFIGS, configs)
}

export async function initConfigManager (configFolder) {
  const confWatcher = GetConfigWatcher(configFolder)

  return new Promise((resolve, reject) => {
    confWatcher.on('loaded', configs => {
      _update(configs)
      console.log(`configs: ${Object.keys(configs).sort().join(',')}`)
      CORSSetup(configs)
      return migrateDB(configs).then(resolve).catch(reject)
    })

    confWatcher.on('changed', (orgid, configs) => {
      _update(configs)
      console.log(`configs: ${Object.keys(configs).sort().join(',')}`)
      CORSSetup(configs)
      migrateDB(configs)
    })
  })
}

function getOrgConfig (req) {
  req.tenantcfg = TENANT_CONFIGS[req.params.tenantid]
  req.tenantid = req.params.tenantid
  return req.tenantcfg !== undefined
}

export function loadOrgConfigMW (req, res, next) {
  return getOrgConfig(req) 
    ? next()
    : next(new APIError(404, 'unknown tenant'))
}