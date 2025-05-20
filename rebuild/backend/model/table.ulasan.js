const tableUlasanModel = {
  name: "ulasan",
  column: [
    ["id_ulasan", "INT NOT NULL AUTO_INCREMENT"],
    ["id_janji_temu", "INT NOT NULL"],
    ["rating", "INT NOT NULL"],
    ["komentar", "TEXT"],
    ["waktu_ulasan", "DATETIME DEFAULT CURRENT_TIMESTAMP"],
  ],
  primaryKey: ["id_ulasan"],
  foreginKey: [
    ["id_janji_temu", "janji_temu", "id_janji_temu"],
  ]
}

export default tableUlasanModel