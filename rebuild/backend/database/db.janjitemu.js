import { queryDB } from "../lib/database.js"
import validateContent from "../validation/global.js"

const statusJanji = {
  menunggu: "Menunggu",
  telat: "Terlambat",
  selesai: "Selesai"
}

async function janjitemu_daftarjanji({ showNext } = {}) {
  const showNextPage = (isNaN(showNext)? 0:parseInt(showNext))*50
  // List daftar janjian
  const getListJanji = await queryDB(`SELECT jt.*,
  t.nama AS tamu_nama,
  t.telepon AS tamu_telepon,
  p.nama AS pengguna_nama,
  p.role AS pengguna_role
FROM janji_temu jt
JOIN tamu t ON jt.id_tamu = t.id_tamu
JOIN pengguna p ON jt.id_guru = p.id_pengguna
LIMIT 50 OFFSET ?`, [showNextPage])
  if(getListJanji.error) {
    return getListJanji.error
  }
  // Return listnya
  return {
    data: getListJanji.data.map(data => ({
      id: data.id_janji_temu,
      pengguna: {
        id: data.id_pengguna,
        nama: data.pengguna_nama,
        role: data.pengguna_role
      },
      tamu: {
        id: data.id_tamu,
        nama: data.tamu_nama,
        telepon: data.tamu_telepon
      },
      tanggal: data.tanggal,
      waktu: data.waktu,
      keperluan: data.keperluan,
      status: statusJanji[data.status],
      kode_qr: data.kode_qr
    }))
  }
}
async function janjitemu_janjiperguru({ id, showNext } = {}) {
  // Validasi ID
  if(!id || isNaN(id) || isNaN(String(parseInt(id)))) {
    return {
      error: "unvalid_idformat",
      message: "ID salah, tidak dapat diterima"
    }
  }
  const showNextPage = (isNaN(showNext)? 0:parseInt(showNext))*50
  // List daftar janjian
  const getListJanji = await queryDB(`SELECT jt.*,
  t.nama AS tamu_nama,
  t.telepon AS tamu_telepon,
  p.nama AS pengguna_nama,
  p.role AS pengguna_role
FROM janji_temu jt
JOIN tamu t ON jt.id_tamu = t.id_tamu
JOIN pengguna p ON jt.id_guru = p.id_pengguna
WHERE jt.id_guru = ?
LIMIT 50 OFFSET ?`, [parseInt(id), showNextPage])
  if(getListJanji.error) {
    return getListJanji.error
  }
  // Return listnya
  return {
    data: getListJanji.data.map(data => ({
      id: data.id_janji_temu,
      pengguna: {
        id: data.id_pengguna,
        nama: data.pengguna_nama,
        role: data.pengguna_role
      },
      tamu: {
        id: data.id_tamu,
        nama: data.tamu_nama,
        telepon: data.tamu_telepon
      },
      tanggal: data.tanggal,
      waktu: data.waktu,
      keperluan: data.keperluan,
      status: statusJanji[data.status],
      kode_qr: data.kode_qr
    }))
  }
}

async function janjitemu_buatperjanjian(authUser, { } = {}) {
  
}

async function janjitemu_statusjanjian({ id, changeStatus } = {}) {
  
}

async function janjitemu_qrcode({ kode } = {}) {
  // List daftar janjian
  const getListJanji = await queryDB(`SELECT jt.*,
  t.nama AS tamu_nama,
  t.telepon AS tamu_telepon,
  p.nama AS pengguna_nama,
  p.role AS pengguna_role
FROM janji_temu jt
JOIN tamu t ON jt.id_tamu = t.id_tamu
JOIN pengguna p ON jt.id_guru = p.id_pengguna
WHERE kode_qr = ?
LIMIT 1`, [String(kode)])
  if(getListJanji.error) {
    return getListJanji.error
  }
  if(getListJanji.noData) {
    return {
      error: "notfound",
      message: "Tidak ditemukan"
    }
  }
  const dataUser = getListJanji.data[0]
  return {
    data: {
      id: dataUser.id_janji_temu,
      pengguna: {
        id: dataUser.id_pengguna,
        nama: dataUser.pengguna_nama,
        role: dataUser.pengguna_role
      },
      tamu: {
        id: dataUser.id_tamu,
        nama: dataUser.tamu_nama,
        telepon: dataUser.tamu_telepon
      },
      tanggal: dataUser.tanggal,
      waktu: dataUser.waktu,
      keperluan: dataUser.keperluan,
      status: statusJanji[dataUser.status],
      kode_qr: dataUser.kode_qr
    }
  }
}

async function janjitemu_hariini({ showNext } = {}) {
  const showNextPage = (isNaN(showNext)? 0:parseInt(showNext))*50
  // List daftar janjian
  const getListJanji = await queryDB(`SELECT jt.*,
  t.nama AS tamu_nama,
  t.telepon AS tamu_telepon,
  p.nama AS pengguna_nama,
  p.role AS pengguna_role
FROM janji_temu jt
JOIN tamu t ON jt.id_tamu = t.id_tamu
JOIN pengguna p ON jt.id_guru = p.id_pengguna
WHERE tanggal = CURRENT_DATE
LIMIT 50 OFFSET ?`, [showNextPage])
  if(getListJanji.error) {
    return getListJanji.error
  }
  // Return listnya
  return {
    data: getListJanji.data.map(data => ({
      id: data.id_janji_temu,
      pengguna: {
        id: data.id_pengguna,
        nama: data.pengguna_nama,
        role: data.pengguna_role
      },
      tamu: {
        id: data.id_tamu,
        nama: data.tamu_nama,
        telepon: data.tamu_telepon
      },
      tanggal: data.tanggal,
      waktu: data.waktu,
      keperluan: data.keperluan,
      status: statusJanji[data.status],
      kode_qr: data.kode_qr
    }))
  }
}

export {
  janjitemu_daftarjanji,
  janjitemu_janjiperguru,


  janjitemu_qrcode,
  janjitemu_hariini,
}