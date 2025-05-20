import { Router } from "express"

const router = Router()

// # Daftar tamu
router.get("/", (req, res) => {
})
// # Tambah tamu baru
router.post("/", (req, res) => {
})
// # Update data tamu
router.put("/:id", (req, res) => {
  const IdTamu = String(req.params?.id||"")
})
router.get("/search", (req, res) => {
  const queryParser = new URLSearchParams(req.url.split("?").slice(1).join("?"))
  const querySearch = String(queryParser.get("q")||"")
})

export default router