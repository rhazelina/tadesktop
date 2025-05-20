import AppointmentForm from '../components/appointment/AppointmentForm';

const AppointmentPage = () => {
  const handleSuccess = (result) => {
    console.log('Appointment created:', result);
  
  };

  return (
    <div className="appointment-page">
      <AppointmentForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AppointmentPage;