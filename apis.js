import _ from 'underscore'
import initContactForms from 'contactform-api'
import { init as InitAnkety, migrateDB as AnketyMigrate } from 'modularni-urad-ankety-api/index'
import { init as InitPaRo, migrateDB as ParoMigrate } from 'modularni-urad-paro-api/index'
import { init as InitBBB } from 'bbb-cms-api/index'
import { init as InitMediaman, migrateDB as MediamanMigrate } from 'modularni-urad-mediaman/index'
import { init as InitEnergoman, migrateDB as EnergomanMigrate } from 'modularni-urad-energo-man/index'
import { init as InitUni, migrateDB as UniMigrate } from 'uni-api/index'
import { init as InitOptionman, migrateDB as OptionmanMigrate } from 'modularni-urad-optionman/index'
import { init as InitProjekty, migrateDB as ProjektyMigrate } from 'project-stack-api/index'
import { init as InitNotifyer, migrateDB as NotifyerMigrate } from 'modularni-urad-notifyer/index'
import { init as InitGroupman, migrateDB as GroupmanMigrate } from 'groupman-api/index'
import { init as InitUser, migrateDB as UserMigrate } from 'userman-api/index'
import { init as InitTaskman, migrateDB as TaskmanMigrate } from 'modularni-urad-taskman/index'
import MUPosts from '@modularni-urad/posts'
import initNIA from 'nia-auth'
import initAuthAPI from 'auth-api'
import initAdmin from './admin'

const apimodules = []

export default {
  init: async function (ctx) {
    const apiRouter = ctx.express()

    apiRouter.use(`/admin`, initAdmin(ctx))

    apimodules.push({ migrateDB: ParoMigrate })
    apiRouter.use(`/paro`, InitPaRo(ctx))

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

    apimodules.push({ migrateDB: GroupmanMigrate })
    apiRouter.use('/groupman', await InitGroupman(ctx)) 

    apimodules.push({ migrateDB: UserMigrate })
    apiRouter.use('/userman', await InitUser(ctx)) 

    apimodules.push({ migrateDB: TaskmanMigrate })
    apiRouter.use('/taskman', await InitTaskman(ctx)) 

    apimodules.push({ migrateDB: MUPosts.migrate })
    apiRouter.use('/posts', await MUPosts.init(ctx))

    apiRouter.use('/contactforms', initContactForms(ctx))
    
    return apiRouter
  },
  apimodules
}