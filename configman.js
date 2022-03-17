import { APIError } from 'modularni-urad-utils'
import InitConfigLoader from 'modularni-urad-utils/config/loader'
import logger from 'modularni-urad-utils/logger'
import { migrateDB } from './db'

export const TENANT_CONFIGS = {}

function _update (orgid, config) {
  if (orgid in TENANT_CONFIGS) {
    delete TENANT_CONFIGS[orgid]
  } else {
    migrateDB([config])
  }
  TENANT_CONFIGS[orgid] = config
}

export async function initConfigManager (configFolder) {
  const configs = await InitConfigLoader(configFolder, _update)
  configs.map(i => TENANT_CONFIGS[i.orgid] = i)
  logger.info(`loaded configs: ${Object.keys(TENANT_CONFIGS).sort().join(',')}`)
  return migrateDB(TENANT_CONFIGS)
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