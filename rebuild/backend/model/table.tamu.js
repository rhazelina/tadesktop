const tableTamuModel = {
  name: "tamu",
  column: [
    ["id_tamu", "INT NOT NULL AUTO_INCREMENT"],
    ["nama", "VARCHAR(255) NOT NULL"],
    ["telepon", "VARCHAR(20) NOT NULL"],
  ],
  primaryKey: ["id_tamu"],
}

export default tableTamuModel