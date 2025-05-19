import { WebSocketServer } from "ws"
import { JsonWebTokenVerify } from "./jsonwebtoken.js"
import * as uuid from "uuid"

let clientUser = {}

function WebSocketRegister(server) {
  const wss = new WebSocketServer({ server: server })
  wss.on("connection", (ws, req) => {
    // Apply Send To WebSocket
    ws.sendJson = (msg) => {
      ws.send(JSON.stringify(msg))
    }
    // Token Auth
    const tokenAuth = String(
      (req?.headers["ws-token"] && req?.headers["ws-token"]?.split(" ")[1]) ||
      new URLSearchParams(req.url?.split("?").slice(1).join("?")).get("token")
    );
    // Verfy Token
    const verify = JsonWebTokenVerify(tokenAuth)
    if(verify.error) {
      ws.sendJson({
        type: verify.type,
        message: verify.message
      })
      ws.close()
      return;
    }
    // Revalidate
    if(typeof verify.data?.user?.id !== "string") {
      ws.sendJson({
        type: "unvaliddatatoken",
        message: "Unvalid Data Token"
      })
      ws.close()
      return;
    }
    // Register User
    const wsIdGenerate = uuid.v4()
    ws.userId = String(verify.data?.user?.id||"")
    console.log("User Connect!, UserID:", ws.userId)
    ws.sendJson({
      type: "ping",
    })
    clientUser[wsIdGenerate] = ws
  })
}

function broadcastQRGenerated(qrId, purpose) {
  Object.keys(clientUser).forEach(wsIdGen => {
    const clientWS = clientUser[wsIdGen]
    clientWS.sendJson({
      type: 'QR_GENERATED',
      data: {
        qrId: qrId,
        purpose: purpose
      }
    })
  })
}

function sendMessage(userIds = ["*"], jsonData) {
  Object.keys(clientUser).forEach(wsIdGen => {
    const clientWS = clientUser[wsIdGen]
    if(!userIds.includes("*") && !userIds.includes(clientWS.userId)) {
      return; // None
    }
    clientUser.sendJson(jsonData)
  })
}

export {
  WebSocketRegister,
  broadcastQRGenerated,
  sendMessage
}