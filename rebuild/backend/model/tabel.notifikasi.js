const tableNotifikasiModel = {
  name: "notifikasi",
  column: [
    ["id_notifikasi", "INT NOT NULL AUTO_INCREMENT"],
    ["id_pengguna", "INT NOT NULL"],
    ["pesan", "VARCHAR(255) NOT NULL"],
    ["waktu", "DATETIME DEFAULT CURRENT_TIMESTAMP"],
    ["is_read", "TINYINT(1) DEFAULT '0'"],
  ],
  primaryKey: ["id_notifikasi"],
  foreginKey: [
    ["id_pengguna","pengguna","id_pengguna"]
  ]
}

export default tableNotifikasiModel