import { Router } from "express"

const router = Router()

// # Daftar janji temu
router.get("/", (req, res) => {
  
})
// # Janji temu per guru
router.get("/guru/:id", (req, res) => {
  const guruId = String(req.params?.id||"")
})
// # Buat janji temu baru
router.post("/", (req, res) => {

})
// # Update status janji temu
router.put("/:id/status", (req, res) => {

})
// # Verifikasi kode QR
router.get("/qr/:qrcode", (req, res) => {
  const qrcodeCode = String(req.params?.id||"")
})
// # Janji temu hari ini
router.get("/today", (req, res) => {

})

export default router