import { Router } from "express"

const router = Router()

// # Daftar notifikasi pengguna
router.get("/", (req, res) => {
  
})
// # Tandai notifikasi sudah dibaca
router.put("/:id/read", (req, res) => {
  const idNotification = String(req.params?.id||"")
})
// # Hapus notifikasi
router.delete("/:id", (req, res) => {
  const idNotification = String(req.params?.id||"")
})

export default router