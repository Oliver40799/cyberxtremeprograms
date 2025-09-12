document.addEventListener('DOMContentLoaded', () => {
    // Datos de los episodios
    const episodios = [
        {
            id: 1,
            titulo: 'El futuro del trabajo',
            descripcion: 'Un debate sobre cómo la tecnología está cambiando nuestras vidas laborales y qué podemos esperar.',
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            comentarios: [
                { autor: 'Ana', texto: '¡Excelente episodio! Muy informativo y relevante para los tiempos que vivimos.' },
                { autor: 'Carlos', texto: 'Me gustó el enfoque en el equilibrio entre la tecnología y el factor humano.' }
            ]
        },
        {
            id: 2,
            titulo: 'Inteligencia Artificial: Mitos y Realidades',
            descripcion: 'Desmitificamos conceptos erróneos sobre la IA y exploramos su impacto en la sociedad.',
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            comentarios: [
                { autor: 'Luisa', texto: 'Increíble cómo la IA ya está en todas partes. ¡Gran tema!' },
                { autor: 'Pedro', texto: 'Esperaba más sobre el lado técnico, pero la discusión social fue fascinante.' }
            ]
        },
        {
            id: 3,
            titulo: 'Emprendimiento en la era digital',
            descripcion: 'Consejos prácticos y lecciones de vida de emprendedores que triunfaron en el mundo online.',
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            comentarios: []
        }
    ];

    const audioPlayerElement = document.getElementById('audio-player-element');
    const playerTitle = document.getElementById('player-title');
    const playerDescription = document.getElementById('player-description');
    const episodesList = document.querySelector('.episodes-list');
    
    // Modales y botones
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const subscribeModal = document.getElementById('subscribe-modal');
    const commentsModal = document.getElementById('comments-modal');
    const commentsModalTitle = document.getElementById('comments-modal-title');
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    let currentEpisodeId = null;

    // Función para renderizar la lista de episodios
    function renderEpisodes() {
        episodesList.innerHTML = '';
        episodios.forEach(episodio => {
            const episodeCard = document.createElement('div');
            episodeCard.classList.add('episode-card');
            episodeCard.dataset.episodeId = episodio.id;
            episodeCard.innerHTML = `
                <div class="episode-info">
                    <h3>${episodio.titulo}</h3>
                    <p>${episodio.descripcion}</p>
                </div>
                <div class="actions">
                    <button class="play-btn"><i class="fa-solid fa-play"></i> Reproducir</button>
                    <button class="comments-btn"><i class="fa-solid fa-comments"></i> Comentarios (${episodio.comentarios.length})</button>
                </div>
            `;
            episodesList.appendChild(episodeCard);
        });
    }

    // Funciones del reproductor de audio
    function playEpisode(episodio) {
        audioPlayerElement.src = episodio.audioSrc;
        playerTitle.textContent = episodio.titulo;
        playerDescription.textContent = episodio.descripcion;
        audioPlayerElement.play();
    }

    episodesList.addEventListener('click', (e) => {
        const episodeCard = e.target.closest('.episode-card');
        if (!episodeCard) return;

        const episodioId = parseInt(episodeCard.dataset.episodeId);
        const episodio = episodios.find(ep => ep.id === episodioId);
        
        if (e.target.classList.contains('play-btn')) {
            playEpisode(episodio);
        } else if (e.target.classList.contains('comments-btn')) {
            openCommentsModal(episodio);
        }
    });

    // Funciones del modal de comentarios
    function openCommentsModal(episodio) {
        currentEpisodeId = episodio.id;
        commentsModalTitle.textContent = `Comentarios en "${episodio.titulo}"`;
        renderComments(episodio.comentarios);
        commentsModal.classList.add('visible');
    }

    function renderComments(comments) {
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>Sé el primero en comentar.</p>';
        } else {
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = `<strong>${comment.autor}:</strong> ${comment.texto}`;
                commentsList.appendChild(commentDiv);
            });
        }
    }

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = e.target.querySelector('textarea');
        const newCommentText = textarea.value;
        if (newCommentText.trim() === '') return;

        const currentEpisode = episodios.find(ep => ep.id === currentEpisodeId);
        currentEpisode.comentarios.push({ autor: 'Anónimo', texto: newCommentText });
        
        renderComments(currentEpisode.comentarios);
        renderEpisodes(); // Actualizar el contador de comentarios en la lista
        textarea.value = '';
    });

    // Funciones de los modales
    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('visible');
    }

    subscribeBtn.addEventListener('click', () => {
        subscribeModal.classList.add('visible');
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.classList.remove('visible');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('visible');
        }
    });

    // Iniciar la página
    renderEpisodes();
    playEpisode(episodios[0]); // Reproducir el primer episodio al cargar la página
});