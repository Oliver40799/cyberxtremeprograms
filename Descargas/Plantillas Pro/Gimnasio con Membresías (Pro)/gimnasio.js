document.addEventListener('DOMContentLoaded', () => {

    // Lógica para la simulación del sistema de membresías
    const joinButtons = document.querySelectorAll('.join-btn');

    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.parentElement.querySelector('h3').textContent;
            alert(`¡Felicidades! Has seleccionado el ${plan}. Un miembro de nuestro equipo te contactará para completar tu registro.`);
        });
    });

    // Lógica para el horario de clases (ejemplo de interactividad)
    const scheduleTable = document.querySelector('.class-schedule');

    scheduleTable.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'TD' && e.target.textContent.trim() !== '') {
            e.target.style.backgroundColor = '#e74c3c';
            e.target.style.color = '#fff';
            e.target.style.fontWeight = 'bold';
        }
    });

    scheduleTable.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'TD') {
            e.target.style.backgroundColor = '';
            e.target.style.color = '';
            e.target.style.fontWeight = '';
        }
    });

});