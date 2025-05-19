const tablePenggunaModel = {
  name: "pengguna",
  column: [
    ["id_pengguna", "INT NOT NULL AUTO_INCREMENT"],
    ["nama", "VARCHAR(255) NOT NULL"],
    ["email", "VARCHAR(255) NOT NULL"],
    ["password", "VARCHAR(255) NOT NULL"],
    ["role", "ENUM('admin','penerimatamu','guru') NOT NULL"],
  ],
  primaryKey: ["id_pengguna"],
}

export default tablePenggunaModel