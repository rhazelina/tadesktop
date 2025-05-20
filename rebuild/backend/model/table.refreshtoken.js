const tableRefreshTokenModel = {
  name: "refresh_tokens",
  column: [
    ["id", "INT NOT NULL AUTO_INCREMENT"],
    ["id_pengguna", "INT NOT NULL"],
    ["token", "VARCHAR(255) NOT NULL"],
    ["expires_at", "DATETIME NOT NULL"],
    ["revoked", "TINYINT(1) DEFAULT '0'"],
    ["created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP"],
  ],
  primaryKey: ["id"],
  foreginKey: [
    ["id_pengguna","pengguna","id_pengguna"]
  ]
}

export default tableRefreshTokenModel