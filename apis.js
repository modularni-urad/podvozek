import _ from 'underscore'
import fs from 'fs'
import path from 'path'
import initContactForms from 'contactform-api'
import { init as InitAnkety, migrateDB as AnketyMigrate } from 'modularni-urad-ankety-api/index'
import { init as InitPaRo, migrateDB as ParoMigrate } from 'modularni-urad-paro-api/index'
import { init as InitBBB, migrateDB as BBBMigrate } from 'bbb-cms-api/index'
import { init as InitMediaman, migrateDB as MediamanMigrate } from 'modularni-urad-mediaman/index'
import { init as InitEnergoman, migrateDB as EnergomanMigrate } from 'modularni-urad-energo-man/index'
import { init as InitUni, migrateDB as UniMigrate } from 'uni-api/index'
import { init as InitOptionman, migrateDB as OptionmanMigrate } from 'modularni-urad-optionman/index'
import { init as InitProjekty, migrateDB as ProjektyMigrate } from 'project-stack-api/index'
import { init as InitNotifyer, migrateDB as NotifyerMigrate } from 'modularni-urad-notifyer/index'
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

    apimodules.push({ migrateDB: EnergomanMigrate })
    apiRouter.use('/energoman', await InitEnergoman(ctx))

    apimodules.push({ migrateDB: AnketyMigrate })
    apiRouter.use('/ankety', await InitAnkety(ctx)) 
    
    apimodules.push({ migrateDB: UniMigrate })
    apiRouter.use('/uni', await InitUni(ctx)) 

    apimodules.push({ migrateDB: OptionmanMigrate })
    apiRouter.use('/optionman', await InitOptionman(ctx)) 

    apimodules.push({ migrateDB: ProjektyMigrate })
    apiRouter.use('/projekty', await InitProjekty(ctx)) 

    apimodules.push({ migrateDB: NotifyerMigrate })
    apiRouter.use('/notifyer', await InitNotifyer(ctx)) 

    apiRouter.use('/contactforms', initContactForms(ctx))
    
    return apiRouter
  },
  apimodules
}