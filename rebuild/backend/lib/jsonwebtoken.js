import jwt from "jsonwebtoken"
import "./env.js"

const jwt_secret = process.env.JWT_SECRET
const jwt_expires = process.env.TOKEN_EXPIRY || "1h"

/**
 * Verify a JSON Web Token (JWT)
 * @param {string|any} token - The JWT token to verify
 * @returns {{data:Object}|{error:String,message:String}} Object containing either:
 * - {Object} data - The decoded token data if verification succeeds
 * - {Object} error - Error object if verification fails, with:
 *   - "tokenexpired" - When token has expired
 *   - "unvalidtoken" - When token is invalid
 *   - "internalerror" - For other errors
 */
function JsonWebTokenVerify(token) {
  try {
    const tokenStg = String(token||"")
    const jsonTokenData = jwt.verify(tokenStg, jwt_secret)
    return {
      data: jsonTokenData
    }
  } catch(e) {
    const nameJwtError = String(e?.name||"")
    // Token Expired
    if(nameJwtError === "TokenExpiredError") {
      return {
        error: "tokenexpired",
        message: "Token kadaluarsa"
      }
    }
    // Token Unvalid
    if(nameJwtError === "JsonWebTokenError") {
      return {
        error: "unvalidtoken",
        message: "Token Tidak Valid"
      }
    }
    console.error("JsonWebTokenVerify Error:", e)
    // Idk
    return {
      error: "internalerror",
      message: "Internal Server Error"
    }
  }
}
/**
 * Sign a JSON Web Token (JWT)
 * @param {Object|String|Buffer} token - The JWT token to signin
 * @returns {{data:String}|{error:String,message:String}} Object containing either:
 * - {Object} data - The encoded token
 * - {Object} error - For internal error
 */
function JsonWebTokenSign(data = {}) {
  try {
    const signJWT = jwt.sign(data, jwt_secret, {
      expiresIn: jwt_expires
    })
    return {
      data: String(signJWT)
    }
  } catch(e) {
    console.error("JsonWebTokenSign Error:", e)
    return {
      error: "internalerror",
      message: "Internal Server Error"
    }
  }
}

export {
  JsonWebTokenVerify,
  JsonWebTokenSign,
  jwt_secret,
  jwt_expires
}