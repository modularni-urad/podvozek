import express from 'express'
import _ from 'underscore'
import { attachPaginate } from 'knex-paginate'
import { initErrorHandlers, APIError } from 'modularni-urad-utils'
import logger from 'modularni-urad-utils/logger.js'
import auth from 'modularni-urad-utils/auth.js'
import { initDB } from './db.js'
import apis from './apis.js'
import { initConfigManager, loadOrgConfigMW } from './configman.js'
import { corsMW } from './corsman.js'
import initSendMail from './mailsend.js'

export default async function init () {
  const knex = await initDB()
  const sendMail = await initSendMail()
  attachPaginate()

  const app = express()

  const ctx = {
    express, knex, auth, 
    bodyParser: express.json(), 
    ErrorClass: APIError,
    sendMail,
    logger
  }
  const apiRouter = await apis.init(ctx)
  app.use('/:tenantid', loadOrgConfigMW, corsMW, apiRouter)

  initErrorHandlers(app) // ERROR HANDLING

  await initConfigManager(process.env.CONFIG_FOLDER)
  return app
}