import chai from 'chai'
import chaiHttp from 'chai-http'
import _ from 'underscore'
import { API_TEST_GROUPS } from './testmodules.js'
import MainIntiFn from './env/init.js'
import InitFN from '../index.js'
// import { getFolderSuites } from 'modularni-urad-utils/test/utils/suite'
chai.use(chaiHttp)
chai.should()

const g = { chai }
MainIntiFn(g)

// async function prepare () {
//   // nedari se mi seznam suits generovat asynchrone :/ mocha to nezere
//   const apps = await getAppFolders()
//   const suites = {}
//   await Promise.all(apps.map(async i => {
//     const suitsFolder = path.join(APIS_DIR, i, 'test/suites')
//     const appsuites = await getFolderSuites(suitsFolder)
//     return suites[i] = appsuites
//   }))
//   return suites
// }

describe('app', () => {
  
  before(() => {
    return g.InitApp(InitFN)
  })
  after(g.close)

  describe('all APIs', async () => {
    // it('shall load all suites', async () => {
    //   const suites = await prepare()
    //   suites.map(i => i(g))
    // })
    // const testmodules = await prepare()
    const tenants = ['mutabor', 'pokus_cz']
    
    _.map(API_TEST_GROUPS, (modulelist, apppath) => {
      modulelist.map(modPath => {
        tenants.map(tenant => {
          g.baseurl = `${g.url}/${tenant}/${apppath}`
          try {
            const subMod = await import(modPath)
            subMod(g)
          } catch (err) {
            console.log('ERROR:', tenant, modPath)
          }
        })
      })
    })
  })

})
