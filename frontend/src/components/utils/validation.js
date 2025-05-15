export const validateAppointmentForm = (formData) => {
  const errors = {};
  
  if (!formData.nama.trim()) {
    errors.nama = 'Nama tamu wajib diisi.';
  }
  
  if (!formData.noHp.trim()) {
    errors.noHp = 'No HP wajib diisi.';
  } else if (!/^08[0-9]{8,14}$/.test(formData.noHp)) {
    errors.noHp = 'Format No HP tidak valid.';
  }
  
  if (!formData.keterangan.trim()) {
    errors.keterangan = 'Keterangan wajib diisi.';
  }
  
  return errors;
};