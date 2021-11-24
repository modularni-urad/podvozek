import express from 'express'
import _ from 'underscore'
import { attachPaginate } from 'knex-paginate'
import {
  auth,
  initErrorHandlers,
  initConfigManager
} from 'modularni-urad-utils'
import { initDB } from './db'
import apis from './apis'
import configman from './configman'
import { corsMW } from './corsman'

export default async function init (mocks = null) {
  const knex = mocks ? await mocks.dbinit() : await initDB()
  attachPaginate()

  const app = express()

  const ctx = {
    express, knex, auth, bodyParser: express.json()
  }
  const apiRouter = await apis.init(ctx)
  app.use('/:tenantid/', configman.loadOrgConfig, corsMW, apiRouter)

  initErrorHandlers(app) // ERROR HANDLING

  await initConfigManager(process.env.CONFIG_FOLDER, configman.onChanged)
  return app
}