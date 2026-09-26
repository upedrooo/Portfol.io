// ================= CONFIGURAÇÕES =================
const PRELOADER_DELAY = 1500;      // Tempo (ms) do cubo girando antes de revelar o site
const PRELOADER_EXIT_TIME = 1000;  // Duração (ms) da saída: deve bater com a transition de #preloader no CSS

// ================= INÍCIO SEMPRE NO TOPO =================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ================= TELA DE LOADING =================
function esconderPreloader() {
    const preloader = document.getElementById('preloader');

    // Destrava a rolagem do site (mesmo que o preloader tenha sido removido do HTML)
    document.body.classList.remove('loading-active');
    if (!preloader) return;

    // Faz a tela subir e, depois, remove a div para não bloquear cliques
    preloader.classList.add('slide-up');
    setTimeout(() => preloader.remove(), PRELOADER_EXIT_TIME);
}

function agendarPreloader() {
    setTimeout(esconderPreloader, PRELOADER_DELAY);
}

if (document.readyState === 'complete') {
    agendarPreloader();
} else {
    window.addEventListener('load', agendarPreloader);
}

// ================= ANIMAÇÃO DE ENTRADA AO ROLAR =================
function ativarAnimacaoDeScroll() {
    const elementos = document.querySelectorAll('.fade-in');

    // Navegadores muito antigos: mostra tudo de uma vez
    if (!('IntersectionObserver' in window)) {
        elementos.forEach((el) => el.classList.add('visivel'));
        return;
    }

    const observer = new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;

            entrada.target.classList.add('visivel');
            obs.unobserve(entrada.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elementos.forEach((el) => observer.observe(el));
}

ativarAnimacaoDeScroll();

// ================= PLAYER DO YOUTUBE (vídeos longos e Shorts) =================
// O player só é criado no clique, o que deixa a página mais leve.
// O ID do vídeo vem do atributo data-video-id do botão.
function iniciarVideo(botao) {
    const container = botao.parentElement.querySelector('.iframe-container');
    const videoId = encodeURIComponent(botao.dataset.videoId);

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = 'Player de vídeo do YouTube';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;

    container.appendChild(iframe);
    botao.hidden = true;
    iframe.focus(); // Mantém o foco do teclado no player
}

document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.video-overlay[data-video-id]');
    if (botao) iniciarVideo(botao);
});
