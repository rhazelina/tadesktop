import WhatsApp from "wa-client"

const wa = new WhatsApp({
  authfolder: `${process.cwd()}/whatsapp/auth`,
  storefolder: `${process.cwd()}/store`,
  viewOnLog: false, // Disable Log
  debugging: 0,  // Disable Log
  qrcode: true, // Sign QRCode
})

export default wa