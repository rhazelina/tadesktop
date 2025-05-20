import { format } from 'date-fns';
import axios from 'axios';

/**
 * Membuat janji temu baru
 * @param {Object} formData - Data form appointment
 * @param {string} formData.nama - Nama tamu
 * @param {string} formData.noHp - Nomor HP tamu
 * @param {string} formData.keterangan - Keterangan appointment
 * @param {Date} formData.tanggal - Tanggal appointment
 * @returns {Promise<Object>} Response dari server
 * @throws {Error} Jika terjadi error saat request
 */

/**
 * Mengambil daftar appointment
 * @returns {Promise<Array>} Array of appointments
 * @throws {Error} Jika terjadi error saat request
 */

/**
 * Mengambil detail appointment
 * @param {string} id - ID appointment
 * @returns {Promise<Object>} Detail appointment
 * @throws {Error} Jika terjadi error saat request
 */

const API_URL = 'http://localhost:5000/api/appointments';

export const createAppointment = async (formData) => {
  try {
    const formattedDate = format(formData.tanggal, 'yyyy-MM-dd');
    const response = await axios.post(API_URL, {
      ...formData,
      tanggal: formattedDate
    });
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error(error.response?.data?.message || 'Gagal membuat janji temu');
  }
};

export const getAppointments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Gagal mengambil data janji temu');
  }
};