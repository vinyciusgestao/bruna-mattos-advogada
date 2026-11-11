// Clínica Bruna Barbosa: comportamento de todas as páginas.
// Quem pediu menos movimento no sistema vê tudo parado; inclinação com o mouse só em computador.
import { CONFIG, RELATOS, RESULTADOS } from './config.js';

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IG = `https://www.instagram.com/${CONFIG.instagram}/`;

/* ================================================================ tela de carregamento */
const carregando = $('.carregando');
if (carregando) {
  const some = () => { carregando.classList.add('is-fim'); setTimeout(() => carregando.remove(), 600); };
  const limite = setTimeout(some, 1400);   // nunca segura a página mais que 1,4 s
  Promise.all([document.fonts?.ready, new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))])
    .then(() => { clearTimeout(limite); setTimeout(some, 250); });
}

/* ================================================================ links de contato */
// Com WhatsApp configurado, abre a conversa já com a mensagem; sem ele, abre o Direct do Instagram.
export function linkContato(msg = CONFIG.mensagemPadrao) {
  return CONFIG.whatsapp
    ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`
    : `https://ig.me/m/${CONFIG.instagram}`;
}
$$('[data-contato]').forEach(a => {
  a.href = linkContato(a.dataset.msg || CONFIG.mensagemPadrao);
  a.target = '_blank'; a.rel = 'noopener';
  a.addEventListener('click', () => evento('clique_contato', { origem: a.dataset.origem || 'site', canal: CONFIG.whatsapp ? 'whatsapp' : 'instagram' }));
});
$$('[data-canal]').forEach(el => { el.textContent = CONFIG.whatsapp ? 'WhatsApp' : 'Instagram'; });
$$('[data-telefone]').forEach(el => {
  if (!CONFIG.telefoneExibicao) { el.closest('[data-telefone-item]')?.remove(); return; }
  el.textContent = CONFIG.telefoneExibicao;
  if (el.tagName === 'A') el.href = `tel:+${CONFIG.whatsapp || CONFIG.telefoneExibicao.replace(/\D/g, '')}`;
});
$$('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ================================================================ cabeçalho e menu */
const topo = $('[data-topo]');
if (topo) {
  const rolou = () => topo.classList.toggle('is-rolado', scrollY > 10);
  rolou(); addEventListener('scroll', rolou, { passive: true });
}
const botaoMenu = $('.topo__menu-btn'), folha = $('#folha');
if (botaoMenu && folha) {
  const abre = v => {
    botaoMenu.setAttribute('aria-expanded', String(v));
    botaoMenu.setAttribute('aria-label', v ? 'Fechar o menu' : 'Abrir o menu');
    folha.classList.toggle('is-aberta', v);
    folha.inert = !v;
    document.body.style.overflow = v ? 'hidden' : '';
    if (v) folha.querySelector('a')?.focus({ preventScroll: true });
  };
  folha.inert = true;
  botaoMenu.addEventListener('click', () => abre(botaoMenu.getAttribute('aria-expanded') !== 'true'));
  folha.addEventListener('click', e => { if (e.target.closest('a')) abre(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && folha.classList.contains('is-aberta')) { abre(false); botaoMenu.focus(); } });
}
const linksMenu = $$('.menu a[href^="#"]');
if (linksMenu.length) {
  const porId = new Map(linksMenu.map(a => [a.hash.slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    const a = porId.get(e.target.id);
    if (a && e.isIntersecting) { linksMenu.forEach(x => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  porId.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ================================================================ CTA fixo no celular */
const ctaFixo = $('.cta-fixo'), hero = $('.hero');
if (ctaFixo) {
  if (hero) new IntersectionObserver(([e]) => ctaFixo.classList.toggle('is-visivel', !e.isIntersecting), { threshold: .35 }).observe(hero);
  else ctaFixo.classList.add('is-visivel');
}

/* ================================================================ resultados: antes e depois */
const galeria = $('[data-galeria]');
if (galeria) {
  galeria.innerHTML = RESULTADOS.map((r, i) => {
    const tem = r.antes && r.depois;
    const antes = tem ? `<img src="${esc(r.antes)}" alt="${esc(r.altAntes)}" loading="lazy" width="800" height="1000">`
      : `<div class="ph ph--antes" role="img" aria-label="${esc(r.altAntes)}"></div>`;
    const depois = tem ? `<img src="${esc(r.depois)}" alt="${esc(r.altDepois)}" loading="lazy" width="800" height="1000">`
      : `<div class="ph ph--depois" role="img" aria-label="${esc(r.altDepois)}"></div>`;
    return `<figure class="comparar" data-comparar data-revela data-inclina style="--i:${i}">
      ${antes}<div class="comparar__depois" style="position:absolute;inset:0">${depois}</div>
      <span class="comparar__rotulo comparar__rotulo--antes">Antes</span><span class="comparar__rotulo comparar__rotulo--depois">Depois</span>
      <span class="comparar__linha"><span class="comparar__alca"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 6-6 6 6 6M15 6l6 6-6 6"/></svg></span></span>
      <input type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: ${esc(r.titulo)}">
      <figcaption><strong>${esc(r.titulo)}</strong>${esc(r.detalhe)}${tem ? '' : ' · foto em breve'}</figcaption>
    </figure>`;
  }).join('');
  $$('[data-comparar]', galeria).forEach(f => {
    const input = $('input', f);
    const atualiza = () => f.style.setProperty('--pos', `${input.value}%`);
    input.addEventListener('input', atualiza);
    // dica de movimento: o comparador "respira" uma vez quando aparece
    if (!reduzido) new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const passo = t => { const k = Math.min(1, (t - t0) / 1400); input.value = 50 + Math.sin(k * Math.PI * 2) * 18 * (1 - k); atualiza(); if (k < 1) requestAnimationFrame(passo); };
      setTimeout(() => requestAnimationFrame(passo), 500);
    }, { threshold: .6 }).observe(f);
  });
}

/* ================================================================ relatos: carrossel 3D */
const carrossel = $('[data-carrossel]');
if (carrossel) {
  const anel = $('.carrossel__anel', carrossel), pontos = $('.pontos', carrossel);
  const n = RELATOS.length, passo = 360 / n;
  const raio = () => Math.round((anel.offsetWidth / 2) / Math.tan(Math.PI / n)) + 40;
  anel.innerHTML = RELATOS.map((v, i) => {
    let midia = '<div class="ph-video" aria-hidden="true"></div>';
    if (v.tipo === 'arquivo') midia = v.capa ? `<img src="${esc(v.capa)}" alt="" loading="lazy">` : `<video src="${esc(v.src)}#t=0.5" muted playsinline preload="metadata" aria-hidden="true"></video>`;
    const rotulo = v.tipo === 'vazio' ? 'Ver relatos no Instagram' : 'Assistir';
    return `<button class="video-card" type="button" data-i="${i}" aria-label="${esc(rotulo)}: ${esc(v.alt)}">
      ${midia}
      <span class="video-card__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>
      <span class="video-card__info"><strong>${esc(v.nome)}</strong><span>${esc(v.procedimento)}</span></span>
    </button>`;
  }).join('');
  pontos.innerHTML = RELATOS.map((v, i) => `<button type="button" aria-label="Relato ${i + 1} de ${n}"></button>`).join('');
  const cards = $$('.video-card', anel), botoes = $$('button', pontos);
  let atual = 0, giro = 0;
  const posiciona = () => {
    const r = raio();
    cards.forEach((c, i) => { c.style.transform = `rotateY(${i * passo}deg) translateZ(${r}px)`; });
    anel.style.transform = `translateZ(${-r}px) rotateY(${giro}deg)`;
    cards.forEach((c, i) => { c.classList.toggle('is-frente', i === atual); c.tabIndex = i === atual ? 0 : -1; });
    botoes.forEach((b, i) => b.setAttribute('aria-current', String(i === atual)));
  };
  const vai = d => { giro -= d * passo; atual = ((atual + d) % n + n) % n; posiciona(); };
  const para = i => { let d = i - atual; if (d > n / 2) d -= n; if (d < -n / 2) d += n; vai(d); };
  $('[data-ant]', carrossel).addEventListener('click', () => vai(-1));
  $('[data-prox]', carrossel).addEventListener('click', () => vai(1));
  botoes.forEach((b, i) => b.addEventListener('click', () => para(i)));
  cards.forEach((c, i) => c.addEventListener('click', () => { if (arrastou) return; i === atual ? abreVideo(RELATOS[i]) : para(i); }));
  carrossel.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') vai(-1); if (e.key === 'ArrowRight') vai(1); });
  // arrastar com o dedo ou o mouse
  let x0 = null, g0 = 0, arrastou = false;
  carrossel.addEventListener('pointerdown', e => { if (e.target.closest('.seta, .pontos')) return; x0 = e.clientX; g0 = giro; arrastou = false; });
  addEventListener('pointermove', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 6) { arrastou = true; carrossel.classList.add('arrastando'); anel.style.transform = `translateZ(${-raio()}px) rotateY(${g0 + dx * .25}deg)`; }
  });
  addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null; carrossel.classList.remove('arrastando');
    if (arrastou) { const d = -Math.round(dx * .25 / passo) || (dx < 0 ? 1 : -1); giro = g0; vai(d); setTimeout(() => { arrastou = false; }, 50); }
  });
  addEventListener('resize', posiciona);
  posiciona();
}

/* janela do vídeo */
const modal = $('[data-modal]');
let focoAntes = null;
function abreVideo(v) {
  if (!v || v.tipo === 'vazio' || !modal) { open(`${IG}reels/`, '_blank', 'noopener'); return; }
  const caixa = $('[data-modal-midia]', modal);
  if (v.tipo === 'arquivo') caixa.innerHTML = `<video src="${esc(v.src)}" ${v.capa ? `poster="${esc(v.capa)}"` : ''} controls autoplay playsinline aria-label="${esc(v.alt)}"></video>`;
  else {
    const codigo = (v.url.match(/\/(reel|p|tv)\/([^/?#]+)/) || [])[2];
    caixa.innerHTML = codigo ? `<iframe src="https://www.instagram.com/reel/${esc(codigo)}/embed" title="${esc(v.alt)}" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>` : '';
  }
  focoAntes = document.activeElement;
  modal.classList.add('is-aberta'); modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('.modal__fechar', modal).focus();
  evento('assistir_relato', { procedimento: v.procedimento });
}
function fechaVideo() {
  modal.classList.remove('is-aberta'); modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { $('[data-modal-midia]', modal).innerHTML = ''; }, 350);
  focoAntes?.focus();
}
if (modal) {
  $('.modal__fechar', modal).addEventListener('click', fechaVideo);
  modal.addEventListener('click', e => { if (e.target === modal) fechaVideo(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-aberta')) fechaVideo(); });
}

/* ================================================================ aparecer ao rolar */
const revelar = $$('[data-revela]');
if (revelar.length && !reduzido && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visto'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  revelar.forEach(el => io.observe(el));
} else revelar.forEach(el => el.classList.add('is-visto'));

/* ================================================================ números que contam */
$$('[data-conta]').forEach(el => {
  const fim = Number(el.dataset.conta), suf = el.dataset.sufixo || '';
  const mostra = v => { el.textContent = v.toLocaleString('pt-BR') + suf; };
  if (reduzido) { mostra(fim); return; }
  mostra(0);
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return; io.disconnect();
    const t0 = performance.now(), dur = 1600;
    const passo = t => { const k = Math.min(1, (t - t0) / dur); mostra(Math.round(fim * (1 - Math.pow(1 - k, 4)))); if (k < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }, { threshold: .6 }).observe(el);
});

/* ================================================================ inclinação 3D com mola */
if (mouse && !reduzido) $$('[data-inclina]').forEach(el => {
  let ax = 0, ay = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0;
  const MAX = Number(el.dataset.inclina) || 8;
  const quadro = () => {
    vx = (vx + (ax - x) * .09) * .8; vy = (vy + (ay - y) * .09) * .8; x += vx; y += vy;
    el.style.transform = `perspective(1000px) rotateY(${x.toFixed(2)}deg) rotateX(${y.toFixed(2)}deg)`;
    raf = Math.abs(ax - x) + Math.abs(ay - y) + Math.abs(vx) + Math.abs(vy) > .02 ? requestAnimationFrame(quadro) : 0;
  };
  el.addEventListener('pointermove', e => {
    el.style.transition = 'none';   // a partir daqui quem move é a mola
    const r = el.getBoundingClientRect();
    ax = ((e.clientX - r.left) / r.width - .5) * 2 * MAX; ay = -((e.clientY - r.top) / r.height - .5) * 2 * MAX;
    if (!raf) raf = requestAnimationFrame(quadro);
  });
  el.addEventListener('pointerleave', () => { ax = 0; ay = 0; if (!raf) raf = requestAnimationFrame(quadro); });
});

/* ================================================================ tratamentos: cartões que viram */
$$('[data-trat]').forEach(card => {
  const frente = $('.trat__frente', card), verso = $('.trat__verso', card);
  const vira = v => {
    card.classList.toggle('is-virado', v);
    frente.inert = v; verso.inert = !v;
    $$('[data-virar]', card).forEach(b => b.setAttribute('aria-expanded', String(v)));
    setTimeout(() => $('[data-virar]', v ? verso : frente)?.focus({ preventScroll: true }), reduzido ? 0 : 450);
  };
  verso.inert = true;
  $$('[data-virar]', card).forEach(b => b.addEventListener('click', () => vira(!card.classList.contains('is-virado'))));
});

/* ================================================================ dúvidas */
$$('[data-pergunta]').forEach(p => {
  const b = $('button', p);
  b.addEventListener('click', () => {
    const v = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(v)); p.classList.toggle('is-aberta', v);
  });
});

/* ================================================================ formulário com erros por campo */
const form = $('[data-form]');
if (form) {
  const regras = {
    nome: v => v.trim().length < 3 ? 'Digite seu nome completo (pelo menos 3 letras).' : /\d/.test(v) ? 'O nome não pode ter números.' : '',
    telefone: v => { const d = v.replace(/\D/g, ''); return !d ? 'Informe seu WhatsApp para a clínica responder.' : (d.length < 10 || d.length > 11) ? 'Use DDD + número, ex.: (73) 99999-8888.' : ''; },
    email: v => v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Esse e-mail parece incompleto. Confira, ou deixe em branco.' : '',
    interesse: v => !v ? 'Escolha o tratamento que mais te interessa.' : '',
    consentimento: (v, el) => !el.checked ? 'Para enviar, aceite a Política de Privacidade.' : '',
  };
  const tel = form.elements.telefone;
  tel.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = d.length > 10 ? d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3') : d.length > 6 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3') : d.length > 2 ? d.replace(/(\d{2})(\d+)/, '($1) $2') : d;
  });
  const valida = (nome, mostrar = true) => {
    const el = form.elements[nome], campo = el.closest('.campo'), msg = regras[nome](el.value, el);
    if (mostrar) {
      campo.classList.remove('tem-erro'); void campo.offsetWidth;
      campo.classList.toggle('tem-erro', !!msg);
      el.setAttribute('aria-invalid', String(!!msg));
      $('.campo__erro', campo).textContent = msg;
    }
    return !msg;
  };
  Object.keys(regras).forEach(nome => {
    const el = form.elements[nome];
    el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') valida(nome); });
    el.addEventListener('input', () => { if (el.closest('.campo').classList.contains('tem-erro')) valida(nome); });
    el.addEventListener('change', () => { if (el.closest('.campo').classList.contains('tem-erro')) valida(nome); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const erros = Object.keys(regras).filter(n => !valida(n));
    const resumo = $('.form__resumo', form);
    if (erros.length) {
      resumo.textContent = erros.length === 1 ? 'Falta corrigir 1 campo antes de enviar.' : `Faltam corrigir ${erros.length} campos antes de enviar.`;
      resumo.classList.add('is-visivel');
      form.elements[erros[0]].focus();
      evento('erro_formulario', { campos: erros.join(',') });
      return;
    }
    resumo.classList.remove('is-visivel');
    const f = form.elements;
    const msg = `Olá! Vim pelo site da Clínica Bruna Barbosa.\n\nNome: ${f.nome.value.trim()}\nWhatsApp: ${f.telefone.value}${f.email.value ? `\nE-mail: ${f.email.value.trim()}` : ''}\nInteresse: ${f.interesse.value}${f.mensagem.value.trim() ? `\nMensagem: ${f.mensagem.value.trim()}` : ''}\n\nGostaria de agendar uma avaliação.`;
    evento('generate_lead', { interesse: f.interesse.value });
    if (CONFIG.whatsapp) open(linkContato(msg), '_blank', 'noopener');
    else { try { navigator.clipboard?.writeText(msg); } catch (_) { /* sem permissão: segue mesmo assim */ } open(linkContato(), '_blank', 'noopener'); }
    try { sessionStorage.setItem('cbb-nome', f.nome.value.trim().split(' ')[0]); } catch (_) { /* navegação privada */ }
    location.href = 'obrigado.html';
  });
}
const nomeObrigado = $('[data-nome-obrigado]');
if (nomeObrigado) { try { const n = sessionStorage.getItem('cbb-nome'); if (n) nomeObrigado.textContent = `, ${n}`; } catch (_) { /* nada */ } }

/* ================================================================ cookies + Google Analytics */
const CHAVE = 'cbb-cookies';
const banner = $('[data-cookies]');
const lerConsentimento = () => { try { return localStorage.getItem(CHAVE); } catch (_) { return null; } };
function carregaAnalytics() {
  if (!CONFIG.gaId || window.gtag) return;
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', CONFIG.gaId, { anonymize_ip: true });
}
function evento(nome, dados = {}) { if (window.gtag) gtag('event', nome, dados); }
if (lerConsentimento() === 'aceito') carregaAnalytics();
if (banner) {
  const mostra = v => { banner.classList.toggle('is-visivel', v); banner.inert = !v; };
  const decide = valor => { try { localStorage.setItem(CHAVE, valor); } catch (_) { /* sem armazenamento */ } mostra(false); if (valor === 'aceito') carregaAnalytics(); };
  $('[data-aceitar]', banner).addEventListener('click', () => decide('aceito'));
  $('[data-recusar]', banner).addEventListener('click', () => decide('recusado'));
  $$('[data-abrir-cookies]').forEach(b => b.addEventListener('click', () => mostra(true)));
  if (!lerConsentimento()) setTimeout(() => mostra(true), 1600); else banner.inert = true;
}

/* ================================================================ cena 3D do topo */
const cena = $('[data-cena3d]');
if (cena) {
  const temGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (_) { return false; } })();
  if (temGL) import('./cena3d.js').then(m => m.iniciar(cena, { reduzido, mouse })).then(() => document.documentElement.classList.add('tem-webgl')).catch(() => { /* fica o fundo em CSS */ });
}
