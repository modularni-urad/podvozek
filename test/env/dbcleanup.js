import { instance } from "../../db"

export default async function cleanupDB() {
  async function removePublicTables () {
    try {
      const tables = await instance.raw(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'`)
      await Promise.all(tables.rows.map(s => {
        return instance.raw(`drop table "${s.table_name}" CASCADE;`)
      }))
      return 'ok'
    } catch (err) {
      return removePublicTables() // recurse until all deleted
    }
  }
  try {
    const schemas = await instance.raw(`
      select schema_name FROM information_schema.schemata`)
    await Promise.all(schemas.rows.map(s => {
      return instance.raw(`drop schema "${s.schema_name}" CASCADE;`)
    }))
    await removePublicTables()
    console.log('DB clean --------------------')
  } catch (err) {
    console.error(err)
  }  
}