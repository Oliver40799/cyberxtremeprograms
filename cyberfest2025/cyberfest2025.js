/* /event/cyberfest.js */
document.addEventListener('DOMContentLoaded', () => {
  const btnIns = document.getElementById('btnInscribirse');
  const btnIns2 = document.getElementById('btnInscribirse2');
  const btnDiscord = document.getElementById('btnDiscord');
  const btnDiscord2 = document.getElementById('btnDiscord2');
  const sponsorBtn = document.getElementById('sponsorBtn');

  const discordInvite = "https://discord.gg/32bbVNRb7y"; // reemplazá
  const inscripcionesUrl = "/Inscripciones/inscripciones.html"; // reemplazá si hace falta
  const kickUrl = "https://kick.com/glitchez"; // reemplazá con enlace real
  const tiktokUrl = "https://www.tiktok.com/@panitaglitch";

  function openLink(url) { window.open(url, '_blank'); }

  if (btnIns) btnIns.addEventListener('click', () => location.href = inscripcionesUrl);
  if (btnIns2) btnIns2.addEventListener('click', () => location.href = inscripcionesUrl);

  if (btnDiscord) btnDiscord.addEventListener('click', () => openLink(discordInvite));
  if (btnDiscord2) btnDiscord2.addEventListener('click', () => openLink(discordInvite));

  if (sponsorBtn) sponsorBtn.addEventListener('click', () => {
    Swal.fire({
      icon: 'info',
      title: '¿Querés patrocinar CyberFest?',
      html: 'Contactanos en Discord o enviá un mensaje a <b>cyberxtremeprograms@gmail.com</b> (placeholder).',
      confirmButtonColor: '#00ffff',
      background: '#07101a',
      color: '#fff'
    });
  });

  // enlaces de stream (si querés mostrar dinámicamente)
  const kickLink = document.getElementById('kickLink');
  const tiktokLink = document.getElementById('tiktokLink');
  if (kickLink) kickLink.href = kickUrl;
  if (tiktokLink) tiktokLink.href = tiktokUrl;
});
