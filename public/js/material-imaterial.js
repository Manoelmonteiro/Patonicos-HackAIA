/* ============================================
   MATERIAL-IMATERIAL.JS — Jogo estilo Tinder
   ============================================ */

const CARTAS = [
  {
    nome: 'Praça São Francisco',
    desc: 'Conjunto monumental em São Cristóvão, Patrimônio Mundial UNESCO.',
    tipo: 'material',
    emoji: '⛪',
    cor: '#1565C0',
  },
  {
    nome: 'Renda Irlandesa',
    desc: 'Técnica têxtil secular das mulheres de Divina Pastora.',
    tipo: 'imaterial',
    emoji: '🧵',
    cor: '#6A1B9A',
  },
  {
    nome: 'Museu da Gente Sergipana',
    desc: 'Museu interativo em Aracaju dedicado à cultura local.',
    tipo: 'material',
    emoji: '🏛️',
    cor: '#1565C0',
  },
  {
    nome: 'Barco de Fogo',
    desc: 'Artefato pirotécnico símbolo do São João de Estância.',
    tipo: 'imaterial',
    emoji: '🚢',
    cor: '#6A1B9A',
  },
  {
    nome: 'Lambe-Sujos e Caboclinhos',
    desc: 'Teatro a céu aberto em Laranjeiras que recria resistência negra.',
    tipo: 'imaterial',
    emoji: '🎭',
    cor: '#6A1B9A',
  },
  {
    nome: 'Museu de Arqueologia de Xingó',
    desc: 'Guarda achados arqueológicos do cânion do Rio São Francisco.',
    tipo: 'material',
    emoji: '🏺',
    cor: '#1565C0',
  },
  {
    nome: 'Forró',
    desc: 'Ritmo musical nordestino com raízes profundas em Sergipe.',
    tipo: 'imaterial',
    emoji: '🎵',
    cor: '#6A1B9A',
  },
  {
    nome: 'Palácio Museu Olímpio Campos',
    desc: 'Sede histórica do governo sergipano, edificação do século XIX.',
    tipo: 'material',
    emoji: '🏛️',
    cor: '#1565C0',
  },
];

// ── Estado ─────────────────────────────────────────────────
let cartas      = [];
let cartaAtual  = 0;
let acertosMI   = 0;
let aguardando  = false;

document.addEventListener('DOMContentLoaded', () => {
  iniciarJogo();
});

function iniciarJogo() {
  cartas     = embaralhar(CARTAS);
  cartaAtual = 0;
  acertosMI  = 0;
  aguardando = false;

  document.getElementById('total-cartas').textContent = cartas.length;
  document.getElementById('resultado-final').style.display = 'none';
  document.getElementById('jogo-container').style.display  = 'block';

  esconderFeedback();
  renderizarCarta();
}

function renderizarCarta() {
  const c = cartas[cartaAtual];
  document.getElementById('carta-num').textContent = cartaAtual + 1;

  const pct = (cartaAtual / cartas.length) * 100;
  document.getElementById('progresso-fill').style.width = pct + '%';

  // Imagem substituída por emoji + cor (sem imagens reais no MVP)
  const img = document.getElementById('carta-img');
  // Cria um canvas como placeholder visual
  img.style.display = 'none';

  const card = document.getElementById('swipe-card');
  // Adiciona fundo colorido como "imagem"
  let placeholder = card.querySelector('.carta-placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.className = 'carta-placeholder';
    placeholder.style.cssText = `
      width:100%; height:300px;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      font-size:5rem;
    `;
    card.insertBefore(placeholder, card.firstChild);
  }
  placeholder.style.background = c.cor;
  placeholder.innerHTML = `<span>${c.emoji}</span>`;

  document.getElementById('carta-nome').textContent = c.nome;
  document.getElementById('carta-desc').textContent = c.desc;

  // Reset animação do card
  card.className = 'swipe-card';
  esconderFeedback();
}

async function responder(escolha) {
  if (aguardando) return;
  aguardando = true;

  const c       = cartas[cartaAtual];
  const acertou = escolha === c.tipo;
  const card    = document.getElementById('swipe-card');

  if (acertou) {
    acertosMI++;
    adicionarPontos(15);
    mostrarFeedback(
      `✅ Correto! <strong>${c.nome}</strong> é um patrimônio <strong>${c.tipo}</strong>.`,
      true
    );
    card.classList.add('swipe-right');
  } else {
    const correto = c.tipo === 'material' ? '🏛️ Material' : '✨ Imaterial';
    mostrarFeedback(
      `❌ Era <strong>${correto}</strong>. ${c.desc}`,
      false
    );
    card.classList.add('swipe-left');
  }

  await sleep(1600);

  cartaAtual++;
  aguardando = false;

  if (cartaAtual >= cartas.length) {
    mostrarResultado();
  } else {
    renderizarCarta();
  }
}

function mostrarResultado() {
  document.getElementById('jogo-container').style.display  = 'none';
  document.getElementById('resultado-final').style.display = 'block';

  const pts = acertosMI * 15;
  document.getElementById('pontos-finais').textContent  = pts;
  document.getElementById('acertos-final').textContent  = acertosMI;
  document.getElementById('total-final').textContent    = cartas.length;
  document.getElementById('estrelas-final').textContent = calcularEstrelas(acertosMI, cartas.length);

  document.getElementById('pontos-total').textContent = AppState.pontosTotal;
  mostrarToast(`🎉 Jogo concluído! +${pts} pontos`, 'sucesso');
}

function jogarNovamente() {
  iniciarJogo();
}