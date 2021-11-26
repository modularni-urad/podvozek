import { APIError } from 'modularni-urad-utils'
import GetConfigWatcher from 'modularni-urad-utils/configloader'
import { migrateDB } from './db'
import { setup as CORSSetup } from './corsman'

let ORG_CONFIGS = null

export async function initConfigManager (configFolder) {
  const confWatcher = GetConfigWatcher(configFolder)

  return new Promise((resolve, reject) => {
    confWatcher.on('loaded', configs => {
      ORG_CONFIGS = configs
      console.log(`configs: ${Object.keys(configs).sort().join(',')}`)
      CORSSetup(configs)
      return migrateDB(configs).then(resolve).catch(reject)
    })

    confWatcher.on('changed', (orgid, configs) => {
      ORG_CONFIGS = configs
      console.log(`configs: ${Object.keys(configs).sort().join(',')}`)
      CORSSetup(configs)
      migrateDB(configs)
    })
  })
}

function getOrgConfig (req) {
  req.orgconfig = ORG_CONFIGS[req.params.tenantid]
  req.schema = req.params.tenantid
  return req.orgconfig !== undefined
}

export function loadOrgConfigMW (req, res, next) {
  return getOrgConfig(req) 
    ? next()
    : next(new APIError(404, 'unknown tenant'))
}