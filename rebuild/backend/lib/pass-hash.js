import bcrypt from "bcrypt"

const saltHash = 10

function hashingPassword(password) {
  return bcrypt.hashSync(password, saltHash)
}

function comparePassword(password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword)
}

export {
  hashingPassword,
  comparePassword
}