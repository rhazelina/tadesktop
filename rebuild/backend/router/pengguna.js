import { Router } from "express"

const router = Router()

// # Daftar pengguna (admin only)
router.get("/", (req, res) => {
  
})
// # Tambah pengguna baru (admin only)
router.post("/", (req, res) => {
  
})
// # Update pengguna (admin only)
router.put("/:id", (req, res) => {

})
// # Hapus pengguna (admin only)
router.delete("/:id", (req, res) => {

})

export default router