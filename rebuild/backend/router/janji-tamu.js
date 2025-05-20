import { Router } from "express"
import middlewareRoleUsed from "../middleware/bycostumrole.js"
import { janjitemu_daftarjanji, janjitemu_hariini, janjitemu_janjiperguru, janjitemu_qrcode } from "../database/db.janjitemu.js"

const router = Router()

const middlewareRole = ["*"]
// # Daftar janji temu
router.get("/", middlewareRoleUsed(middlewareRole), async (req, res) => {
  const dataList = await janjitemu_daftarjanji({ showNext: req.query?.next })
  return res
    .status(dataList.data? 200:(dataList?.errorcode || dataList?.error === "internalerror"?500:400))
    .json(dataList)
})
// # Janji temu per guru
router.get("/guru/:id", middlewareRoleUsed(middlewareRole), async (req, res) => {
  const guruId = String(req.params?.id||"")
  const dataListGuru = await janjitemu_janjiperguru({
    id: guruId,
    showNext: req.query?.next
  })
  return res
    .status(dataListGuru.data? 200:(dataListGuru?.errorcode || dataListGuru?.error === "internalerror"?500:400))
    .json(dataListGuru)
})
// # Buat janji temu baru
router.post("/", middlewareRoleUsed(middlewareRole), async (req, res) => {

})
// # Update status janji temu
router.put("/:id/status", middlewareRoleUsed(middlewareRole), async (req, res) => {

})
// # Verifikasi kode QR
router.get("/qr/:qrcode", middlewareRoleUsed(middlewareRole), async (req, res) => {
  const qrcodeCode = String(req.params?.qrcode||"")
  const dataValidasiQR = await janjitemu_qrcode({ kode: qrcodeCode })
  return res
    .status(dataValidasiQR.data? 200:(dataValidasiQR?.errorcode || dataValidasiQR?.error === "internalerror"?500:dataValidasiQR.error === "notfound"?404:400))
    .json(dataValidasiQR)
})
// # Janji temu hari ini
router.get("/today", middlewareRoleUsed(middlewareRole), async (req, res) => {
  const dataListSekarang = await janjitemu_hariini({ showNext: req.query?.next })
  return res
    .status(dataListSekarang.data? 200:(dataListSekarang?.errorcode || dataListSekarang?.error === "internalerror"?500:400))
    .json(dataListSekarang)
})

export default router