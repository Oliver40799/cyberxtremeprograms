document.addEventListener('DOMContentLoaded', () => {

    // Lógica para el formulario de agendamiento de citas
    const appointmentForm = document.getElementById('appointment-form');
    
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se recargue

        // Recopila los datos del formulario
        const patientName = document.getElementById('patient-name').value;
        const doctor = document.getElementById('doctor-select').options[document.getElementById('doctor-select').selectedIndex].text;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const history = document.getElementById('patient-history').value;

        // Muestra un resumen de la cita
        const appointmentSummary = `
            Resumen de la Cita:
            Paciente: ${patientName}
            Doctor: ${doctor}
            Fecha: ${date}
            Hora: ${time}
            Motivo: ${history}
        `;

        alert('¡Cita agendada con éxito! Revisa tu correo electrónico para los detalles.\n\n' + appointmentSummary);
        
        // Puedes resetear el formulario si lo deseas
        appointmentForm.reset();
    });

});