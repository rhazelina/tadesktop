import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { createAppointment } from '../../services/appointmentService';
import { validateAppointmentForm } from '../../utils/validation';

const AppointmentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nama: '',
    noHp: '',
    keterangan: '',
    tanggal: new Date(),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    const validationErrors = validateAppointmentForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const result = await createAppointment(formData);
      
      setSubmitMessage({ 
        type: 'success', 
        text: `Janji Temu berhasil dibuat untuk tanggal ${format(formData.tanggal, 'dd MMMM yyyy')}`
      });
      
      // Reset form
      setFormData({ nama: '', noHp: '', keterangan: '', tanggal: new Date() });
      setErrors({});
      
      // Callback untuk parent component jika perlu
      if (onSuccess) onSuccess(result);
    } catch (error) {
      setSubmitMessage({ 
        type: 'error', 
        text: error.message || 'Gagal membuat janji temu. Silakan coba lagi.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-6 py-10">
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-20 rotate-[45deg] bg-orange-400 top-[30%] left-[-10%] rounded-xl" />
        <div className="absolute w-full h-20 rotate-[45deg] bg-[#1D3D4C] top-[35%] left-[10%] rounded-xl" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-white bg-[#1D3D4C] px-6 py-3 rounded-md z-10 mb-6">
        TAMBAH JANJI TEMU
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center z-10 gap-6">
        <div className="bg-[#1D3D4C] text-white rounded-t-xl w-[300px]">
          <div className="text-center font-bold py-2 rounded-t-xl bg-[#1D3D4C]">KALENDER</div>
          <div className="bg-white text-black rounded-b-xl p-4">
            <div className="font-bold text-center mb-2">PILIH TANGGAL</div>
            <DatePicker
              selected={formData.tanggal}
              onChange={(date) => setFormData({ ...formData, tanggal: date })}
              inline
              className="w-full"
              minDate={new Date()}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 w-[300px] space-y-4 relative">
          <h2 className="text-lg font-bold text-[#1D3D4C] mb-2">TAMBAH JANJI TEMU</h2>

          {submitMessage.text && (
            <div className={`p-2 rounded-md text-sm ${
              submitMessage.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {submitMessage.text}
            </div>
          )}

          <div>
            <label className="block font-semibold text-sm">Nama Tamu</label>
            <input
              type="text"
              name="nama"
              placeholder="Input Nama Tamu"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border-2 rounded-md px-3 py-2 mt-1"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block font-semibold text-sm">No Hp Tamu</label>
            <input
              type="text"
              name="noHp"
              placeholder="081234567890"
              value={formData.noHp}
              onChange={handleChange}
              className="w-full border-2 rounded-md px-3 py-2 mt-1"
            />
            {errors.noHp && <p className="text-red-500 text-xs mt-1">{errors.noHp}</p>}
          </div>

          <div>
            <label className="block font-semibold text-sm">Keterangan</label>
            <input
              type="text"
              name="keterangan"
              placeholder="Meeting / Interview"
              value={formData.keterangan}
              onChange={handleChange}
              className="w-full border-2 rounded-md px-3 py-2 mt-1"
            />
            {errors.keterangan && <p className="text-red-500 text-xs mt-1">{errors.keterangan}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#1D3D4C] text-white py-2 px-4 w-full rounded-md font-semibold hover:bg-[#274c5f] transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Buat Janji Temu'}
          </button>
        </form>
      </div>
    </div>
  );
}

AppointmentForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default AppointmentForm;