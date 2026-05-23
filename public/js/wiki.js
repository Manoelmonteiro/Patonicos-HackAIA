/* ============================================
   WIKI.JS — Wiki colaborativa sergipana
   ============================================ */

// ── Base de dados local (seed) ─────────────────────────────
const WIKI_SEED = [
  {
    id: 1,
    titulo: 'Renda Irlandesa de Divina Pastora',
    descricao: 'Técnica têxtil secular reconhecida pelo IPHAN como Patrimônio Cultural do Brasil. Ensinada por freiras irlandesas e adaptada pelas mulheres sergipanas, produz peças com agulha, linha e lacê.',
    cidade: 'Divina Pastora',
    categoria: 'artesanato',
    tipo: 'imaterial',
    autor: 'CajuCultura',
    fonte: 'IPHAN',
    aprovado: true,
    emoji: '🧵',
  },
  {
    id: 2,
    titulo: 'Barco de Fogo de Estância',
    descricao: 'Artefato pirotécnico símbolo do São João de Estância. Construído em madeira e papelão, desliza sobre arame impulsionado por foguetes, enchendo o céu de faíscas e emoção.',
    cidade: 'Estância',
    categoria: 'festa',
    tipo: 'imaterial',
    autor: 'CajuCultura',
    fonte: 'Prefeitura de Estância',
    aprovado: true,
    emoji: '🚢',
  },
  {
    id: 3,
    titulo: 'Praça São Francisco — São Cristóvão',
    descricao: 'Conjunto arquitetônico na 4ª cidade mais antiga do Brasil, chancelado pela UNESCO em 2010 como Patrimônio Mundial. Fusão ímpar das arquiteturas portuguesa e espanhola do período da União Ibérica.',
    cidade: 'São Cristóvão',
    categoria: 'patrimonio',
    tipo: 'material',
    autor: 'CajuCultura',
    fonte: 'UNESCO',
    aprovado: true,
    emoji: '⛪',
  },
  {
    id: 4,
    titulo: 'Lambe-Sujos e Caboclinhos',
    descricao: 'Festa folclórica realizada em outubro em Laranjeiras. Teatro a céu aberto que recria a batalha entre negros escravizados (pintados com melaço) e indígenas, celebrando a resistência quilombola.',
    cidade: 'Laranjeiras',
    categoria: 'festa',
    tipo: 'imaterial',
    autor: 'CajuCultura',
    fonte: 'Prefeitura de Laranjeiras',
    aprovado: true,
    emoji: '🎭',
  },
  {
    id: 5,
    titulo: 'Museu da Gente Sergipana',
    descricao: 'Um dos museus interativos mais modernos do Brasil, situado em Aracaju no prédio de um antigo colégio. Criado nos moldes do Museu da Língua Portuguesa, celebra a identidade e o folclore sergipano.',
    cidade: 'Aracaju',
    categoria: 'patrimonio',
    tipo: 'material',
    autor: 'CajuCultura',
    fonte: 'Governo de Sergipe',
    aprovado: true,
    emoji: '🏛️',
  },
  {
    id: 6,
    titulo: 'Arthur Bispo do Rosário',
    descricao: 'Artista plástico nascido em Japaratuba. Internado em colônia psiquiátrica no Rio de Janeiro, produziu mantos e estandartes com sucata. Obras expostas na Bienal de Veneza.',
    cidade: 'Japaratuba',
    categoria: 'outro',
    tipo: 'imaterial',
    autor: 'CajuCultura',
    fonte: 'Museu Bispo do Rosário',
    aprovado: true,
    emoji: '🎨',
  },
];

// ── Estado ─────────────────────────────────────────────────
let wikiItens  = [...WIKI_SEED];
let meuEnvios  = JSON.parse(localStorage.getItem('cs_wiki_envios') || '[]');
let tabAtiva   = 'explorar';
let termoBusca = '';

// ── Inicialização ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderizarWiki();
  renderizarMeusEnvios();
});

// ── Tabs ───────────────────────────────────────────────────
function mostrarTab(tab) {
  tabAtiva = tab;
  ['explorar','enviar','enviados'].forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
}

// ── Busca ──────────────────────────────────────────────────
function filtrarWiki() {
  termoBusca = (document.getElementById('wiki-busca')?.value || '').toLowerCase();
  renderizarWiki();
}

document.addEventListener('keyup', (e) => {
  if (e.target.id === 'wiki-busca') filtrarWiki();
});

// ── Render grid ────────────────────────────────────────────
function renderizarWiki() {
  const grid = document.getElementById('wiki-grid');
  if (!grid) return;

  const todos = [...wikiItens, ...meuEnvios.filter(e => e.aprovado)];

  const filtrados = termoBusca
    ? todos.filter(i =>
        i.titulo.toLowerCase().includes(termoBusca) ||
        i.descricao.toLowerCase().includes(termoBusca) ||
        i.cidade.toLowerCase().includes(termoBusca)
      )
    : todos;

  if (!filtrados.length) {
    grid.innerHTML = `<p style="color:var(--cor-texto-leve); grid-column:1/-1; text-align:center; padding:40px;">
      Nenhum resultado encontrado.
    </p>`;
    return;
  }

  grid.innerHTML = filtrados.map(item => {
    const badgeClass = item.tipo === 'material' ? 'badge-material' : 'badge-imaterial';
    const badgeTxt   = item.tipo === 'material' ? '🏛️ Material' : '✨ Imaterial';
    const catLabel   = mapCategoria(item.categoria);
    return `
      <div class="card" onclick="abrirModal(${item.id})" style="cursor:pointer;">
        <div style="height:130px; background:linear-gradient(135deg,var(--cor-primaria),#ff9800);
                    display:flex; align-items:center; justify-content:center; font-size:4rem;">
          ${item.emoji || '📦'}
        </div>
        <div class="card-body">
          <h3 style="font-size:0.95rem;">${item.titulo}</h3>
          <p style="font-size:0.78rem; margin-top:4px;">📍 ${item.cidade}</p>
          <div style="margin-top:8px;">
            <span class="card-badge ${badgeClass}">${badgeTxt}</span>
            <span class="card-badge" style="background:#F5F5F5;color:#555;">${catLabel}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function mapCategoria(cat) {
  const map = {
    festa:'🎉 Festa', danca:'💃 Dança', musica:'🎵 Música',
    artesanato:'🧶 Artesanato', gastronomia:'🍽️ Gastronomia',
    patrimonio:'🏛️ Patrimônio', folclore:'👹 Folclore',
    religioso:'⛪ Religioso', natureza:'🌿 Natureza', outro:'📦 Outro',
  };
  return map[cat] || cat;
}

// ── Modal de detalhe ───────────────────────────────────────
function abrirModal(id) {
  const todos = [...wikiItens, ...meuEnvios];
  const item  = todos.find(i => i.id === id);
  if (!item) return;

  // Cria modal dinamicamente
  let overlay = document.getElementById('wiki-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'wiki-modal';
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) fecharModal(); };
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal-content">
      <div style="font-size:4rem; text-align:center; margin-bottom:16px;">${item.emoji || '📦'}</div>
      <h2 style="margin-bottom:8px;">${item.titulo}</h2>
      <p style="font-size:0.82rem; color:var(--cor-texto-leve); margin-bottom:16px;">
        📍 ${item.cidade} &nbsp;|&nbsp; ${mapCategoria(item.categoria)}
      </p>
      <p style="line-height:1.7; margin-bottom:16px;">${item.descricao}</p>
      ${item.fonte ? `<p style="font-size:0.78rem; color:var(--cor-texto-leve);">📚 Fonte: ${item.fonte}</p>` : ''}
      <br>
      <button class="btn btn-primario" onclick="fecharModal()" style="width:100%;">Fechar</button>
    </div>
  `;
  overlay.classList.add('ativo');
}

function fecharModal() {
  const m = document.getElementById('wiki-modal');
  if (m) m.classList.remove('ativo');
}

// ── Enviar conteúdo ────────────────────────────────────────
function enviarWiki() {
  const titulo    = document.getElementById('wiki-titulo')?.value.trim();
  const descricao = document.getElementById('wiki-descricao')?.value.trim();
  const cidade    = document.getElementById('wiki-cidade')?.value.trim();
  const categoria = document.getElementById('wiki-categoria')?.value;
  const tipo      = document.getElementById('wiki-tipo')?.value;
  const autor     = document.getElementById('wiki-autor')?.value.trim() || 'Anônimo';
  const fonte     = document.getElementById('wiki-fonte')?.value.trim();

  if (!titulo || !descricao || !cidade || !categoria || !tipo) {
    mostrarToast('⚠️ Preencha todos os campos obrigatórios!', 'erro');
    return;
  }

  const novoId = Date.now();
  const novo = {
    id: novoId,
    titulo,
    descricao,
    cidade,
    categoria,
    tipo,
    autor,
    fonte,
    aprovado: false,   // Moderação pendente
    emoji: '📝',
    enviadoEm: new Date().toLocaleDateString('pt-BR'),
  };

  meuEnvios.push(novo);
  localStorage.setItem('cs_wiki_envios', JSON.stringify(meuEnvios));

  // Limpa formulário
  ['wiki-titulo','wiki-descricao','wiki-cidade','wiki-autor','wiki-fonte'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['wiki-categoria','wiki-tipo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });

  mostrarToast('✅ Enviado para análise! Obrigado pela contribuição 🎉', 'sucesso');
  renderizarMeusEnvios();
  mostrarTab('enviados');
}

// ── Meus envios ────────────────────────────────────────────
function renderizarMeusEnvios() {
  const container = document.getElementById('meus-envios');
  if (!container) return;

  if (!meuEnvios.length) {
    container.innerHTML = `<p style="text-align:center; color:var(--cor-texto-leve); padding:40px;">
      Nenhum envio ainda. Contribua com a wiki sergipana!
    </p>`;
    return;
  }

  container.innerHTML = meuEnvios.map(e => `
    <div style="background:var(--cor-card); border-radius:var(--raio-borda);
                padding:16px; margin-bottom:12px; box-shadow:var(--sombra-card);
                border-left:4px solid ${e.aprovado ? 'var(--cor-sucesso)' : 'var(--cor-primaria)'};">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h4>${e.emoji} ${e.titulo}</h4>
          <p style="font-size:0.82rem; color:var(--cor-texto-leve);">📍 ${e.cidade} &nbsp;|&nbsp; ${e.enviadoEm}</p>
        </div>
        <span style="font-size:0.75rem; padding:4px 10px; border-radius:20px;
                     background:${e.aprovado ? 'var(--cor-secundaria-clara)' : 'var(--cor-primaria-clara)'};
                     color:${e.aprovado ? 'var(--cor-secundaria)' : 'var(--cor-primaria)'};">
          ${e.aprovado ? '✅ Aprovado' : '⏳ Em análise'}
        </span>
      </div>
    </div>
  `).join('');
}