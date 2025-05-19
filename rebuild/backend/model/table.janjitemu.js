const tableJanjiTamuModel = {
  name: "janji_temu",
  column: [
    ["id_janji_temu", "INT NOT NULL AUTO_INCREMENT"],
    ["id_tamu", "INT NOT NULL"],
    ["id_guru", "INT NOT NULL"],
    ["tanggal", "DATE NOT NULL"],
    ["waktu", "TIME NOT NULL"],
    ["keperluan", "VARCHAR(255) NOT NULL"],
    ["status", "ENUM('telat','selesai','menunggu') NOT NULL"],
    ["kode_qr", "VARCHAR(50) NOT NULL"],
  ],
  primaryKey: ["id_janji_temu"],
  foreginKey: [
    ["id_tamu", "tamu", "id_tamu"],
    ["id_guru", "pengguna", "id_pengguna"]
  ]
}

export default tableJanjiTamuModel