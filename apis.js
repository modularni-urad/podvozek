import _ from 'underscore'
import fs from 'fs'
import path from 'path'
import { init as InitPaRo, migrateDB as ParoMigrate } from 'modularni-urad-paro-api/index'
import { init as InitBBB, migrateDB as BBBMigrate } from 'bbb-cms-api/index'
import { init as InitMediaman, migrateDB as MediamanMigrate } from 'modularni-urad-mediaman/index'
import initNIA from 'nia-auth'
import initAuthAPI from 'auth-api'

export const APIS_DIR = path.resolve(process.env.APIS_DIR || './api_modules')

const apimodules = []

export async function getAppFolders () {
  const modContent = await fs.promises.readdir(APIS_DIR)
  return modContent
}

export default {
  init: async function (ctx) {
    const apiRouter = ctx.express()
    const modContent = await getAppFolders()
    _.map(modContent, subpath => {
      try {
        const apiMod = require(path.join(APIS_DIR, subpath, 'index'))
        apiRouter.use(`/${subpath}`, apiMod.init(ctx))
        apimodules.push(apiMod)
        console.log(`---- API ${subpath} mounted ------`)
      } catch (err) {
        console.error(`---- API ${subpath} import FAILED! ---------`)
        console.error(err)
      }
    })
    apimodules.push({ migrateDB: ParoMigrate })
    apiRouter.use(`/paro`, InitPaRo(ctx))

    apimodules.push({ migrateDB: BBBMigrate })
    apiRouter.use(`/bbb`, InitBBB(ctx))

    apiRouter.use(`/nia`, await initNIA(ctx))
    apiRouter.use(`/auth`, await initAuthAPI(ctx))

    apimodules.push({ migrateDB: MediamanMigrate })
    apiRouter.use('/mediaman', await InitMediaman(ctx))
    
    return apiRouter
  },
  apimodules
}