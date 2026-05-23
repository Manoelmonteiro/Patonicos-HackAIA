/* ============================================
   CULTURA SERGIPE — app.js
   Funções globais compartilhadas por todas as páginas
   ============================================ */

const API_BASE = '/api';

// ── Estado global ──────────────────────────────────────────
const AppState = {
  pontosTotal: parseInt(localStorage.getItem('cs_pontos') || '0'),
  sessao: null,       // { perfil, id, nome, turma_codigo, ... }
  turmaAtiva: null,
};

// ── Inicialização ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  carregarSessao();
  atualizarPlacarFlutuante();
  iniciarCajusDecorativos();
});

// ── Sessão (localStorage) ──────────────────────────────────
function carregarSessao() {
  const raw = localStorage.getItem('cs_sessao');
  if (raw) {
    try { AppState.sessao = JSON.parse(raw); } catch (_) {}
  }
}

function salvarSessao(dados) {
  AppState.sessao = dados;
  localStorage.setItem('cs_sessao', JSON.stringify(dados));
}

function limparSessao() {
  AppState.sessao = null;
  localStorage.removeItem('cs_sessao');
}

// ── Pontuação ──────────────────────────────────────────────
function adicionarPontos(pts, x, y) {
  AppState.pontosTotal += pts;
  localStorage.setItem('cs_pontos', AppState.pontosTotal);
  atualizarPlacarFlutuante();
  if (x !== undefined && y !== undefined) animarPontos(pts, x, y);
}

function atualizarPlacarFlutuante() {
  const el = document.getElementById('pontos-total');
  if (el) el.textContent = AppState.pontosTotal;
}

function animarPontos(pts, x, y) {
  const el = document.createElement('div');
  el.className = 'ponto-animacao';
  el.textContent = `+${pts}`;
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ── Toast ──────────────────────────────────────────────────
function mostrarToast(msg, tipo = '', duracao = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast visivel ${tipo}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
  }, duracao);
}

// ── Feedback box ───────────────────────────────────────────
function mostrarFeedback(texto, acertou) {
  const box = document.getElementById('feedback-box');
  const txt = document.getElementById('feedback-texto');
  if (!box || !txt) return;
  txt.innerHTML = texto;
  box.className = `feedback-box visivel ${acertou ? 'correto' : 'incorreto'}`;
}

function esconderFeedback() {
  const box = document.getElementById('feedback-box');
  if (box) box.className = 'feedback-box';
}

// ── Estrelas (resultado) ───────────────────────────────────
function calcularEstrelas(acertos, total) {
  const pct = acertos / total;
  if (pct >= 0.8) return '⭐⭐⭐';
  if (pct >= 0.5) return '⭐⭐';
  return '⭐';
}

// ── API helper ─────────────────────────────────────────────
async function apiRequest(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || `Erro ${res.status}`);
  }
  return data;
}

// ── Acessibilidade ─────────────────────────────────────────
function toggleTEA() {
  document.body.classList.toggle('modo-tea');
  localStorage.setItem('cs_tea', document.body.classList.contains('modo-tea'));
}

function toggleContraste() {
  document.body.classList.toggle('alto-contraste');
  localStorage.setItem('cs_contraste', document.body.classList.contains('alto-contraste'));
}

let _fontSize = 16;
function aumentarFonte() {
  _fontSize = Math.min(_fontSize + 2, 24);
  document.body.style.fontSize = _fontSize + 'px';
}
function diminuirFonte() {
  _fontSize = Math.max(_fontSize - 2, 12);
  document.body.style.fontSize = _fontSize + 'px';
}

// Restaura preferências de acessibilidade
(function restaurarAcessibilidade() {
  if (localStorage.getItem('cs_tea') === 'true')
    document.body.classList.add('modo-tea');
  if (localStorage.getItem('cs_contraste') === 'true')
    document.body.classList.add('alto-contraste');
})();

// ── Cajus decorativos (páginas que usam) ──────────────────
function iniciarCajusDecorativos() {
  const bg = document.getElementById('cajuBg');
  if (!bg) return;
  const emojis = ['🥭','🌿','🍊','🌾','✨'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      font-size:${2+Math.random()*2.5}rem;
      opacity:0.15;
      animation: floatCaju ${6+Math.random()*5}s ease-in-out infinite;
      animation-delay:${Math.random()*6}s;
      pointer-events:none;
    `;
    bg.appendChild(s);
  }
}

// ── Utilitários ────────────────────────────────────────────
function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}