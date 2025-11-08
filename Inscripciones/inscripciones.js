document.getElementById('formInscripcion').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const jugador1 = document.getElementById('jugador1').value.trim();
  const jugador2 = document.getElementById('jugador2').value.trim();
  const gamertag1 = document.getElementById('gamertag1').value.trim();
  const gamertag2 = document.getElementById('gamertag2').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const experiencia = document.getElementById('experiencia').value;
  const plataforma = document.getElementById('plataforma').value;
  const comentario = document.getElementById('comentario').value.trim();

  if (!jugador1 || !jugador2 || !correo || !plataforma) {
    Swal.fire({
      icon: 'error',
      title: 'Faltan campos por llenar',
      text: 'Por favor completa todos los campos obligatorios.',
      confirmButtonColor: '#00ffff',
      background: '#0a0a0f',
      color: '#fff',
      showClass: { popup: 'animate__animated animate__shakeX' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
    return;
  }

  // Enviar a Formspree
  const data = new FormData(form);
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Inscripción enviada! 🚀',
        html: `
          <b>${jugador1}</b> y <b>${jugador2}</b> están registrados.<br>
          Recibirán un correo a <b>${correo}</b> con más detalles pronto, gracias por participar.
        `,
        confirmButtonText: 'Perfecto',
        confirmButtonColor: '#00ffff',
        background: '#0a0a0f',
        color: '#fff',
        showClass: { popup: 'animate__animated animate__zoomIn' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
      });

      // Animación al enviar
      form.classList.add('animate__fadeOut');
      setTimeout(() => {
        form.reset();
        form.classList.remove('animate__fadeOut');
        form.classList.add('animate__fadeIn');
      }, 1000);
    } else {
      throw new Error('Error en el envío');
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al enviar',
      text: 'Ocurrió un problema al enviar tu inscripción. Inténtalo de nuevo.',
      confirmButtonColor: '#00ffff',
      background: '#0a0a0f',
      color: '#fff'
    });
  }
});
