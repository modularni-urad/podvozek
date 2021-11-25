import _ from 'underscore'
import fs from 'fs'
import path from 'path'

export const APIS_DIR = path.resolve(process.env.APIS_DIR || './.apis')
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
    return apiRouter
  },
  apimodules
}