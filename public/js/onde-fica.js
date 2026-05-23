/* ============================================
   ONDE-FICA.JS — Jogo de localização no mapa
   ============================================ */

const PERGUNTAS_MAPA = [
  {
    nome: 'Renda Irlandesa',
    descricao: 'Técnica de renda secular produzida pelas mulheres desta cidade.',
    emoji: '🧵',
    // Coordenadas SVG aproximadas no viewBox 0 0 400 500
    cx: 250, cy: 300,    // Divina Pastora
    cidade: 'Divina Pastora',
  },
  {
    nome: 'Barco de Fogo',
    descricao: 'Maior símbolo pirotécnico do São João desta cidade.',
    emoji: '🚢',
    cx: 260, cy: 430,    // Estância
    cidade: 'Estância',
  },
  {
    nome: 'Lambe-Sujos e Caboclinhos',
    descricao: 'Teatro a céu aberto que recria a resistência negra e indígena.',
    emoji: '🎭',
    cx: 270, cy: 320,    // Laranjeiras
    cidade: 'Laranjeiras',
  },
  {
    nome: 'Praça São Francisco',
    descricao: 'Conjunto arquitetônico Patrimônio Mundial UNESCO.',
    emoji: '⛪',
    cx: 290, cy: 370,    // São Cristóvão
    cidade: 'São Cristóvão',
  },
  {
    nome: 'Museu de Arqueologia de Xingó',
    descricao: 'Museu no cânion do Rio São Francisco com achados pré-históricos.',
    emoji: '🏺',
    cx: 120, cy: 60,     // Canindé de São Francisco
    cidade: 'Canindé do São Francisco',
  },
];

// ── Estado ─────────────────────────────────────────────────
let perguntas   = [];
let perguntaIdx = 0;
let acertosMap  = 0;
let pinAtivo    = null;   // { x, y } clique do usuário
let aguardando  = false;

// Tolerância em pixels SVG para considerar acerto
const TOLERANCIA = 60;

document.addEventListener('DOMContentLoaded', () => {
  iniciarJogo();
  configurarMapa();
});

function iniciarJogo() {
  perguntas   = embaralhar(PERGUNTAS_MAPA);
  perguntaIdx = 0;
  acertosMap  = 0;
  aguardando  = false;
  pinAtivo    = null;

  document.getElementById('total-perguntas').textContent = perguntas.length;
  document.getElementById('resultado-final').style.display    = 'none';
  document.getElementById('pergunta-container').style.display = 'block';

  esconderFeedback();
  mostrarPergunta();
}

function configurarMapa() {
  const svg = document.getElementById('svg-mapa');
  if (!svg) return;

  svg.addEventListener('click', (e) => {
    if (aguardando) return;

    const rect  = svg.getBoundingClientRect();
    const vbW   = 400;
    const vbH   = 500;
    const scaleX = vbW / rect.width;
    const scaleY = vbH / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top)  * scaleY;

    pinAtivo = { x, y };
    mostrarUserPin(x, y);

    document.getElementById('btn-confirmar').disabled = false;
  });
}

function mostrarUserPin(x, y) {
  const pin = document.getElementById('user-pin');
  pin.setAttribute('cx', x);
  pin.setAttribute('cy', y);
  pin.style.display = 'block';
}

function mostrarCorretoPin(x, y) {
  const pin = document.getElementById('correct-pin');
  pin.setAttribute('cx', x);
  pin.setAttribute('cy', y);
  pin.style.display = 'block';
}

function mostrarLinha(x1, y1, x2, y2) {
  const line = document.getElementById('pin-line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.style.display = 'block';
}

function esconderPins() {
  document.getElementById('user-pin').style.display    = 'none';
  document.getElementById('correct-pin').style.display = 'none';
  document.getElementById('pin-line').style.display    = 'none';
}

function mostrarPergunta() {
  const p = perguntas[perguntaIdx];
  pinAtivo   = null;
  aguardando = false;

  esconderPins();
  esconderFeedback();

  const pct = (perguntaIdx / perguntas.length) * 100;
  document.getElementById('progresso-fill').style.width = pct + '%';
  document.getElementById('pergunta-num').textContent   = perguntaIdx + 1;

  document.getElementById('btn-confirmar').disabled        = true;
  document.getElementById('btn-proxima').style.display     = 'none';
  document.getElementById('btn-confirmar').style.display   = 'inline-block';

  // Imagem — usa emoji como placeholder
  const img = document.getElementById('imagem-pergunta');
  img.style.display = 'none';

  // Placeholder visual
  let ph = document.getElementById('pergunta-placeholder');
  if (!ph) {
    ph = document.createElement('div');
    ph.id = 'pergunta-placeholder';
    ph.style.cssText = `
      width:100%; height:200px; border-radius:12px;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      background:linear-gradient(135deg, var(--cor-primaria), #ff9800);
      margin-bottom:16px; font-size:5rem;
    `;
    img.parentNode.insertBefore(ph, img);
  }
  ph.innerHTML = `<span>${p.emoji}</span>`;

  document.getElementById('nome-cultura').textContent = p.nome;
}

function confirmarResposta() {
  if (!pinAtivo || aguardando) return;
  aguardando = true;

  const p = perguntas[perguntaIdx];
  const dx = pinAtivo.x - p.cx;
  const dy = pinAtivo.y - p.cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const acertou = dist <= TOLERANCIA;

  // Mostra pins
  mostrarCorretoPin(p.cx, p.cy);
  if (!acertou) {
    mostrarLinha(pinAtivo.x, pinAtivo.y, p.cx, p.cy);
  }

  let pts = 0;
  if (acertou) {
    acertosMap++;
    pts = dist < 25 ? 30 : 20;
    adicionarPontos(pts);
    mostrarFeedback(
      `✅ Correto! É em <strong>${p.cidade}</strong>. +${pts} pontos`,
      true
    );
  } else {
    mostrarFeedback(
      `❌ Era em <strong>${p.cidade}</strong>. A bolinha verde mostra o local correto!`,
      false
    );
  }

  document.getElementById('btn-confirmar').style.display = 'none';
  document.getElementById('btn-proxima').style.display   = 'inline-block';
}

function proximaPergunta() {
  perguntaIdx++;
  if (perguntaIdx < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  document.getElementById('pergunta-container').style.display = 'none';
  document.getElementById('resultado-final').style.display    = 'block';

  const pts = AppState.pontosTotal;
  document.getElementById('pontos-finais').textContent  = pts;
  document.getElementById('acertos-final').textContent  = acertosMap;
  document.getElementById('total-final').textContent    = perguntas.length;
  document.getElementById('estrelas-final').textContent = calcularEstrelas(acertosMap, perguntas.length);
  document.getElementById('pontos-total').textContent   = pts;

  mostrarToast('🎉 Jogo concluído!', 'sucesso');
}

function jogarNovamente() {
  iniciarJogo();
}