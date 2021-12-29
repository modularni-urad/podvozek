import knex from 'knex'
import assert from 'assert'
import _ from  'underscore'
import apis from './apis'

export let instance = null

export function initDB () {
  assert.ok(process.env.DATABASE_URL, 'env.DATABASE_URL not defined!')
  
  instance = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: process.env.NODE_ENV === 'debug',
    migrations: {
      disableMigrationsListValidation: true
    }
  })
  return instance
}

export function migrateDB(configs) {
  const schemas = _.map(configs, (v, k) => {
    return v.orgid
  })
  return apis.apimodules.reduce((p, apiMod) => {
    return p.then(() => apiMod.migrateDB(instance, schemas, configs))
  }, Promise.resolve())
}