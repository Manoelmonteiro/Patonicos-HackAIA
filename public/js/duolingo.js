/* ============================================
   DUOLINGO.JS — Lições interativas de cultura
   ============================================ */

// ── Base de lições ─────────────────────────────────────────
const LICOES = [
  {
    id: 1,
    titulo: '🎭 Patrimônio Imaterial',
    emoji: '🎭',
    nivel: 1,
    cor: '#E8721C',
    perguntas: [
      {
        tipo: 'multipla',
        texto: 'Qual cidade é famosa pela Renda Irlandesa, reconhecida pelo IPHAN?',
        opcoes: ['Aracaju', 'Divina Pastora', 'Estância', 'Laranjeiras'],
        correta: 'Divina Pastora',
        dica: 'O nome da cidade sugere algo divino e pastoral 🐑',
        explicacao: 'A Renda Irlandesa de Divina Pastora é Patrimônio Cultural do Brasil — técnica ensinada por freiras irlandesas e adaptada localmente.',
      },
      {
        tipo: 'vf',
        texto: 'O Barco de Fogo é uma tradição pirotécnica do São João de Estância, onde uma estrutura de madeira desliza sobre um arame.',
        correta: true,
        dica: 'Pense em fogo + água + São João 🎆',
        explicacao: 'Verdade! O Barco de Fogo é o símbolo máximo do São João de Estância, deslizando sobre arame impulsionado por foguetes.',
      },
      {
        tipo: 'multipla',
        texto: 'A festa dos Lambe-Sujos e Caboclinhos acontece em qual cidade sergipana?',
        opcoes: ['São Cristóvão', 'Propriá', 'Laranjeiras', 'Neópolis'],
        correta: 'Laranjeiras',
        dica: 'O nome da cidade lembra uma fruta cítrica 🍊',
        explicacao: 'A festa de Laranjeiras recria em outubro a resistência negra e indígena, com participantes pintados de negro com melaço.',
      },
    ],
  },
  {
    id: 2,
    titulo: '🏛️ Patrimônio Material',
    emoji: '🏛️',
    nivel: 1,
    cor: '#1565C0',
    perguntas: [
      {
        tipo: 'multipla',
        texto: 'Qual conjunto arquitetônico sergipano foi tombado pela UNESCO em 2010?',
        opcoes: [
          'Museu da Gente Sergipana',
          'Praça São Francisco em São Cristóvão',
          'Forte de Coimbra',
          'Mercado Antônio Franco',
        ],
        correta: 'Praça São Francisco em São Cristóvão',
        dica: 'Fica na 4ª cidade mais antiga do Brasil 🇧🇷',
        explicacao: 'A Praça São Francisco em São Cristóvão é Patrimônio Mundial da UNESCO — fusão das arquiteturas portuguesa e espanhola.',
      },
      {
        tipo: 'vf',
        texto: 'O Museu da Gente Sergipana foi construído em um prédio totalmente novo, projetado especialmente para ele.',
        correta: false,
        dica: 'Museus históricos costumam reutilizar edificações antigas 🏫',
        explicacao: 'Falso! O museu ocupa o prédio de um antigo colégio em Aracaju, com tecnologia interativa inspirada no Museu da Língua Portuguesa.',
      },
      {
        tipo: 'multipla',
        texto: 'O Museu de Arqueologia de Xingó está relacionado a qual grande obra de infraestrutura?',
        opcoes: [
          'Construção da BR-101',
          'Usina Hidrelétrica de Xingó',
          'Canal do Sertão Sergipano',
          'Porto de Sergipe',
        ],
        correta: 'Usina Hidrelétrica de Xingó',
        dica: 'A água cobriu muito da história 💧',
        explicacao: 'O museu guarda achados arqueológicos resgatados antes do alagamento pelo reservatório da UHE Xingó no Rio São Francisco.',
      },
    ],
  },
  {
    id: 3,
    titulo: '🌟 Personalidades Sergipanas',
    emoji: '🌟',
    nivel: 2,
    cor: '#6A1B9A',
    perguntas: [
      {
        tipo: 'multipla',
        texto: 'Arthur Bispo do Rosário nasceu em qual município sergipano?',
        opcoes: ['Aracaju', 'Japaratuba', 'Tobias Barreto', 'Lagarto'],
        correta: 'Japaratuba',
        dica: 'Cidade pequena no agreste sergipano 🌵',
        explicacao: 'Bispo do Rosário nasceu em Japaratuba e passou décadas internado no Rio de Janeiro, criando obras hoje expostas em museus do mundo.',
      },
      {
        tipo: 'vf',
        texto: 'Tobias Barreto foi um filósofo sergipano que introduziu o pensamento positivista de Auguste Comte no Brasil.',
        correta: false,
        dica: 'Ele se inspirava em filósofos de língua alemã 🇩🇪',
        explicacao: 'Falso! Tobias Barreto introduziu a filosofia alemã (não o positivismo) no Brasil, sendo central na Escola do Recife.',
      },
      {
        tipo: 'multipla',
        texto: 'Clemilda, a "Rainha do Forró", apresentou por anos um programa em qual emissora sergipana?',
        opcoes: ['TV Sergipe', 'TV Atalaia', 'TV Aperipê', 'TV Cidade'],
        correta: 'TV Aperipê',
        dica: 'O nome da emissora é indígena 🪶',
        explicacao: 'Clemilda apresentou "Forró no Asfalto" na TV Aperipê, tornando-se ícone do forró em Sergipe — mesmo sendo pernambucana de nascimento.',
      },
    ],
  },
  {
    id: 4,
    titulo: '🗣️ Dialeto Sergipanês',
    emoji: '🗣️',
    nivel: 2,
    cor: '#2E7D32',
    perguntas: [
      {
        tipo: 'multipla',
        texto: 'Em Sergipanês, o que significa dizer que uma roupa ficou "foló" no corpo?',
        opcoes: ['Muito justa', 'Larga/frouxa', 'Suja', 'Rasgada'],
        correta: 'Larga/frouxa',
        dica: 'Pense em algo que não aperta, que sobra espaço 👕',
        explicacao: '"Foló" = afrouxado, largo. Ex: "Emagreci tanto que a calça ficou foló!"',
      },
      {
        tipo: 'multipla',
        texto: 'Dar uma "gaitada" em Sergipanês significa:',
        opcoes: [
          'Tocar gaita de boca',
          'Dar uma rasteira',
          'Dar uma gargalhada',
          'Fazer bagunça',
        ],
        correta: 'Dar uma gargalhada',
        dica: 'É uma reação a algo muito engraçado 😂',
        explicacao: '"Gaitada" = gargalhada escandalosa. "A piada foi tão boa que todo mundo deu uma gaitada!"',
      },
      {
        tipo: 'vf',
        texto: '"Avexado" em Sergipanês significa alguém que está com pressa ou agitado.',
        correta: true,
        dica: 'Avexado lembra "vexame" — urgência 🏃',
        explicacao: 'Verdade! "Avexado" = apressado, agitado. "Num fica assim avexado, que a gente chega lá!"',
      },
    ],
  },
  {
    id: 5,
    titulo: '🪶 Povos e Comunidades',
    emoji: '🪶',
    nivel: 3,
    cor: '#D32F2F',
    perguntas: [
      {
        tipo: 'multipla',
        texto: 'Qual é o único povo indígena com terra demarcada e reconhecida em Sergipe?',
        opcoes: ['Tupinambá', 'Pataxó', 'Xocó', 'Kariri'],
        correta: 'Xocó',
        dica: 'Vivem às margens do Rio São Francisco, em Porto da Folha 🌊',
        explicacao: 'O Povo Xocó na Ilha de São Pedro (Porto da Folha) é o único grupo indígena com território demarcado em Sergipe.',
      },
      {
        tipo: 'vf',
        texto: 'Os Xocó habitam principalmente a região do litoral sul de Sergipe.',
        correta: false,
        dica: 'Pense no maior rio do Nordeste 🏞️',
        explicacao: 'Falso! Os Xocó vivem no sertão sergipano, às margens do Rio São Francisco, no município de Porto da Folha.',
      },
      {
        tipo: 'multipla',
        texto: 'O Vale do Cotinguiba em Sergipe ficou historicamente conhecido pela produção de:',
        opcoes: ['Algodão', 'Cacau', 'Cana-de-açúcar', 'Tabaco'],
        correta: 'Cana-de-açúcar',
        dica: 'Doce como a cultura local 🍬',
        explicacao: 'O Vale do Cotinguiba foi o principal polo canavieiro de Sergipe, contexto histórico das festas como Lambe-Sujos e Caboclinhos.',
      },
    ],
  },
];

// ── Estado do jogo ─────────────────────────────────────────
let licaoAtual   = null;
let perguntaIdx  = 0;
let acertos      = 0;
let respostaDada = false;
let pontosLicao  = 0;

// ── Inicialização ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderizarLicoes();
});

function renderizarLicoes() {
  const grid = document.getElementById('licoes-grid');
  if (!grid) return;

  // Recupera progresso salvo
  const progresso = JSON.parse(localStorage.getItem('cs_licoes_prog') || '{}');

  grid.innerHTML = LICOES.map(l => {
    const completa = progresso[l.id];
    const estrelas = completa ? calcularEstrelas(completa.acertos, l.perguntas.length) : '';
    return `
      <div class="card" onclick="iniciarLicao(${l.id})" style="cursor:pointer;">
        <div style="height:120px; background:${l.cor};
                    display:flex; flex-direction:column;
                    align-items:center; justify-content:center; color:white;">
          <span style="font-size:3rem;">${l.emoji}</span>
          <span style="font-size:0.85rem; font-weight:600; margin-top:6px;">Nível ${l.nivel}</span>
        </div>
        <div class="card-body">
          <h3>${l.titulo}</h3>
          <p style="font-size:0.82rem; color:var(--cor-texto-leve);">
            ${l.perguntas.length} perguntas
          </p>
          ${completa
            ? `<p style="margin-top:8px;">${estrelas}
                 <span style="font-size:0.78rem; color:var(--cor-texto-leve);">
                   ${completa.acertos}/${l.perguntas.length} acertos
                 </span>
               </p>`
            : '<span class="card-badge badge-imaterial">Não jogado</span>'
          }
        </div>
      </div>
    `;
  }).join('');
}

function iniciarLicao(id) {
  licaoAtual  = LICOES.find(l => l.id === id);
  perguntaIdx = 0;
  acertos     = 0;
  pontosLicao = 0;

  document.getElementById('selecao-licoes').style.display = 'none';
  document.getElementById('resultado-licao').style.display = 'none';
  document.getElementById('licao-ativa').style.display = 'block';

  document.getElementById('licao-titulo').textContent = licaoAtual.titulo;
  document.getElementById('licao-nivel').textContent  = licaoAtual.nivel;
  document.getElementById('total-perguntas').textContent = licaoAtual.perguntas.length;

  mostrarPergunta();
}

function mostrarPergunta() {
  const p = licaoAtual.perguntas[perguntaIdx];
  respostaDada = false;

  // Progresso
  const pct = (perguntaIdx / licaoAtual.perguntas.length) * 100;
  document.getElementById('progresso-fill').style.width = pct + '%';
  document.getElementById('pergunta-num').textContent = perguntaIdx + 1;

  // Texto
  document.getElementById('pergunta-texto').textContent = p.texto;

  // Esconder dica e feedback
  document.getElementById('dica-container').style.display = 'none';
  document.getElementById('dica-texto').textContent = p.dica;
  esconderFeedback();

  // Botões
  document.getElementById('btn-dica').style.display    = 'inline-block';
  document.getElementById('btn-proximo').style.display = 'none';

  // Opções
  const container = document.getElementById('opcoes-container');
  container.innerHTML = '';

  if (p.tipo === 'multipla') {
    const ops = embaralhar(p.opcoes);
    ops.forEach(op => {
      const btn = document.createElement('button');
      btn.className = 'opcao-btn';
      btn.textContent = op;
      btn.onclick = () => responderMultipla(op, btn);
      container.appendChild(btn);
    });
  } else {
    // Verdadeiro/Falso
    container.innerHTML = `
      <div class="vf-btns">
        <button class="vf-btn verdadeiro" onclick="responderVF(true, this)">✅ Verdadeiro</button>
        <button class="vf-btn falso"      onclick="responderVF(false, this)">❌ Falso</button>
      </div>
    `;
  }
}

function mostrarDica() {
  document.getElementById('dica-container').style.display = 'block';
}

function responderMultipla(opcao, btn) {
  if (respostaDada) return;
  respostaDada = true;

  const p = licaoAtual.perguntas[perguntaIdx];
  const acertou = opcao === p.correta;

  // Marca botões
  document.querySelectorAll('.opcao-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === p.correta) b.classList.add('correta');
  });
  if (!acertou) btn.classList.add('incorreta');

  processarResposta(acertou, p.explicacao);
}

function responderVF(resposta, btn) {
  if (respostaDada) return;
  respostaDada = true;

  const p = licaoAtual.perguntas[perguntaIdx];
  const acertou = resposta === p.correta;

  document.querySelectorAll('.vf-btn').forEach(b => b.disabled = true);
  btn.style.background = acertou ? 'var(--cor-sucesso)' : 'var(--cor-erro)';
  btn.style.color = 'white';

  processarResposta(acertou, p.explicacao);
}

function processarResposta(acertou, explicacao) {
  if (acertou) {
    acertos++;
    pontosLicao += 20;
    adicionarPontos(20);
    mostrarFeedback(`✅ Correto! ${explicacao}`, true);
  } else {
    mostrarFeedback(`❌ Errado. ${explicacao}`, false);
  }

  document.getElementById('btn-dica').style.display    = 'none';
  document.getElementById('btn-proximo').style.display = 'inline-block';
}

function proximaPergunta() {
  perguntaIdx++;
  if (perguntaIdx < licaoAtual.perguntas.length) {
    mostrarPergunta();
  } else {
    finalizarLicao();
  }
}

function finalizarLicao() {
  // Salva progresso
  const prog = JSON.parse(localStorage.getItem('cs_licoes_prog') || '{}');
  prog[licaoAtual.id] = { acertos, total: licaoAtual.perguntas.length };
  localStorage.setItem('cs_licoes_prog', JSON.stringify(prog));

  document.getElementById('licao-ativa').style.display    = 'none';
  document.getElementById('resultado-licao').style.display = 'block';

  document.getElementById('pontos-finais').textContent  = pontosLicao;
  document.getElementById('acertos-final').textContent  = acertos;
  document.getElementById('total-final').textContent    = licaoAtual.perguntas.length;
  document.getElementById('estrelas-final').textContent = calcularEstrelas(acertos, licaoAtual.perguntas.length);

  // Atualiza placar geral
  document.getElementById('pontos-total').textContent = AppState.pontosTotal;

  mostrarToast(`🎉 Lição concluída! +${pontosLicao} pontos`, 'sucesso');
}

function voltarLicoes() {
  document.getElementById('licao-ativa').style.display    = 'none';
  document.getElementById('resultado-licao').style.display = 'none';
  document.getElementById('selecao-licoes').style.display  = 'block';
  renderizarLicoes();
}