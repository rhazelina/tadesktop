import tablePenggunaModel from "./table.pengguna.js"
import tableTamuModel from "./table.tamu.js"
import tableUlasanModel from "./table.ulasan.js"
import tableJanjiTemuModel from "./table.janjitemu.js"
import tableNotifikasiModel from "./tabel.notifikasi.js"
import tableRefreshTokensModel from "./table.refreshtoken.js"

const globalTable = "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"

function modelToQuery(objectData) {
  const queryTop = 'CREATE TABLE IF NOT EXISTS `'+objectData.name+'` ('
  const buildColumn = objectData.column.map(a => ('  `'+a[0]+'` '+a[1])).join(",\n")
  const primaryKey = Array.isArray(objectData.primaryKey)? objectData?.primaryKey?.map(a => `  PRIMARY KEY (\`${a}\`)`).join(",\n"):""
  const foreginKey = Array.isArray(objectData.foreginKey)? objectData?.foreginKey?.map(a => `  FOREIGN KEY (\`${a[0]}\`) REFERENCES \`${a[1]}\`\(\`${a[2]}\`) ON DELETE CASCADE`).join(",\n"):""
  const buildingInsert = String((buildColumn)+""+(primaryKey?`,\n${primaryKey}`:"")+""+(foreginKey?`,\n${foreginKey}`:"")).trimEnd()
  return queryTop+'\n'+buildingInsert+'\n) '+globalTable+';'
}

const registerModel = [
  tableTamuModel,
  tablePenggunaModel,
  tableNotifikasiModel,
  tableRefreshTokensModel,
  tableJanjiTemuModel,
  tableUlasanModel,
]

async function initModelsDatabase(poolDB) {
  const checkTime = new Date().getTime() // Only For Time
  try {
    for(let modelTable of registerModel) {
      const buildQuery = modelToQuery(modelTable)
      await poolDB.query(buildQuery)
    }
    console.log("[InitModelDatabase]: Executed on "+((new Date().getTime() - checkTime)/1000)+"s")
    console.log("[InitModelDatabase]: Success Initialized!")
  } catch(e) {
    console.error("[InitModelDatabase Error]:", e)
  }
}

export default initModelsDatabase