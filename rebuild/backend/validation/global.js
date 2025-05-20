import { dataschema, msgschema } from "./validate.js"

const nameLabelType = {
  string: "Kata",
  number: "Angka",
  object: "Objek",
  array: "List"
}

function validateSchema(type, data) {
  try {
    const validateFc = dataschema[type]
    // No Validation Register
    if(!validateFc) {
      return {
        error: "unvalidschema",
        message: "Tidak memiliki data skema yang harus divalidasi"
      }
    }
    validateFc.validateSync(data)
    return undefined
  } catch(e) {
    console.log("Validation Global:", e.stack)
    if(!!e?.errors[0]) {
      const stringMessage = String(e.errors[0])
      // Type data validation
      if(stringMessage.match("must be a")) {
        const typeDataValidate = String(stringMessage.split("must be a")[1].split("`")[1]).toLowerCase()
        return {
          error: "unvalidata",
          datatype: `formdata_${typeDataValidate}`,
          message: `${nameLabelType[typeDataValidate]}`
        }
      }
      return {
        error: "unvalidata",
        datatype: stringMessage?.split("|")[0],
        message: stringMessage?.split("|")[1]?
          stringMessage.split("|")[1]:
          msgschema[stringMessage.split("|")[0]]
      }
    }
    return {
      error: "internalerror",
      message: "Internal Server Error"
    }
  }
}

export default validateSchema