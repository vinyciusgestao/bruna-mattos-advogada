// Site de Bruna Mattos, advogada: todo o comportamento das páginas num só arquivo.
// Regras de movimento: só anima o que informa ou responde ao visitante; nada se desloca para quem pediu
// menos movimento no sistema; inclinação com o mouse só em computador.

/* ================================================================ CONFIGURAÇÃO */
// GOOGLE ANALYTICS 4: cole aqui o ID de medição (formato G-XXXXXXXXXX). Vazio = nenhum analytics é carregado.
const GA_ID = '';
const WHATSAPP = '559591367145';
const CHAVE_COOKIES = 'bm-cookies';

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ================================================================ tela de carregamento */
const carregando = $('.carregando');
if (carregando) {
  const some = () => { carregando.classList.add('is-fim'); setTimeout(() => carregando.remove(), 320); };
  const limite = setTimeout(some, 700);   // nunca segura a página mais que 0,7 s
  Promise.all([document.fonts?.ready, new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))])
    .then(() => { clearTimeout(limite); some(); });
}

/* ================================================================ cabeçalho e menu */
const topo = $('[data-topo]');
const hero = $('.hero');
if (topo && hero) {
  // sobre o topo azul o cabeçalho é transparente; depois dele vira uma barra clara
  new IntersectionObserver(([e]) => topo.classList.toggle('is-solido', !e.isIntersecting), { rootMargin: `-${topo.offsetHeight}px 0px 0px 0px` }).observe(hero);
}
if (topo) {
  const rolou = () => topo.classList.toggle('is-rolado', scrollY > 8);
  rolou(); addEventListener('scroll', rolou, { passive: true });
}
const botaoMenu = $('.topo__menu-btn');
const folha = $('#folha');
if (botaoMenu && folha) {
  const abre = v => {
    botaoMenu.setAttribute('aria-expanded', String(v));
    botaoMenu.setAttribute('aria-label', v ? 'Fechar o menu' : 'Abrir o menu');
    folha.classList.toggle('is-aberta', v);
    topo.classList.toggle('menu-aberto', v);
    document.body.style.overflow = v ? 'hidden' : '';
    if (v) folha.querySelector('a')?.focus({ preventScroll: true });
  };
  botaoMenu.addEventListener('click', () => abre(botaoMenu.getAttribute('aria-expanded') !== 'true'));
  folha.addEventListener('click', e => { if (e.target.closest('a')) abre(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && folha.classList.contains('is-aberta')) { abre(false); botaoMenu.focus(); } });
}
// a seção na tela marca o seu link no menu
const linksMenu = $$('.menu a[href*="#"]');
{
  const porId = new Map(linksMenu.map(a => [a.hash.slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    const a = porId.get(e.target.id);
    if (a && e.isIntersecting) { linksMenu.forEach(x => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  porId.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ================================================================ aparecer ao rolar */
const revelar = $$('[data-revela]');
if (revelar.length && !reduzido && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visto'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revelar.forEach(el => io.observe(el));
} else revelar.forEach(el => el.classList.add('is-visto'));

/* ================================================================ prazos: os números contam até o valor */
const contadores = $$('[data-conta]');
if (contadores.length && !reduzido) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, fim = Number(el.dataset.conta), t0 = performance.now(), dur = 1100;
    const passo = agora => {
      const t = Math.min(1, (agora - t0) / dur), v = Math.round(fim * (1 - Math.pow(1 - t, 4)));
      el.textContent = String(v);
      if (t < 1) requestAnimationFrame(passo);
    };
    el.textContent = '0';
    requestAnimationFrame(passo);
  }), { threshold: 0.6 });
  contadores.forEach(el => io.observe(el));
}

/* ================================================================ áreas: cards que giram em 3D */
$$('[data-area]').forEach(card => {
  const frente = $('.area__frente', card), verso = $('.area__verso', card);
  const focaveis = face => $$('a, button', face);
  const vira = v => {
    card.classList.toggle('is-virado', v);
    frente.setAttribute('aria-hidden', String(v)); verso.setAttribute('aria-hidden', String(!v));
    focaveis(frente).forEach(el => el.tabIndex = v ? -1 : 0);
    focaveis(verso).forEach(el => el.tabIndex = v ? 0 : -1);
    $$('[data-virar]', card).forEach(b => b.setAttribute('aria-pressed', String(v)));
    // o foco vai para o botão do outro lado, depois de a face aparecer
    setTimeout(() => (v ? $('[data-virar]', verso) : $('[data-virar]', frente))?.focus({ preventScroll: true }), reduzido ? 0 : 420);
  };
  $$('[data-virar]', card).forEach(b => b.addEventListener('click', () => vira(!card.classList.contains('is-virado'))));
});

/* ================================================================ perguntas: abrem e fecham */
$$('[data-pergunta]').forEach(p => {
  const b = $('button', p);
  b.addEventListener('click', () => {
    const v = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(v));
    p.classList.toggle('is-aberta', v);
  });
});

/* ================================================================ retrato do topo: profundidade 3D com mola */
const retrato = $('[data-retrato]'), cena = $('[data-cena]');
if (retrato && cena && mouse && !reduzido) {
  let ax = 0, ay = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0;
  const K = 0.08, AMORTECE = 0.78, MAX = 7;
  const quadro = () => {
    vx = (vx + (ax - x) * K) * AMORTECE; vy = (vy + (ay - y) * K) * AMORTECE; x += vx; y += vy;
    cena.style.transform = `rotateY(${x.toFixed(2)}deg) rotateX(${y.toFixed(2)}deg)`;
    raf = Math.abs(ax - x) + Math.abs(ay - y) + Math.abs(vx) + Math.abs(vy) > 0.01 ? requestAnimationFrame(quadro) : 0;
  };
  hero.addEventListener('pointermove', e => {
    const r = retrato.getBoundingClientRect();
    ax = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width))) * MAX;
    ay = -Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height))) * MAX;
    if (!raf) raf = requestAnimationFrame(quadro);
  });
  hero.addEventListener('pointerleave', () => { ax = 0; ay = 0; if (!raf) raf = requestAnimationFrame(quadro); });
  cena.style.transition = 'none';
}

/* ================================================================ passos + medalha 3D */
const lista = $('[data-passos]');
const passos = lista ? $$('[data-passo]', lista) : [];
let ativo = 0;
function ativa(n) {
  if (n === ativo) return;
  ativo = n;
  lista.classList.add('is-vivo');
  passos.forEach((li, i) => { li.classList.toggle('is-ativo', i + 1 === n); li.classList.toggle('is-feito', i + 1 < n); });
  lista.style.setProperty('--p', passos.length > 1 ? (n - 1) / (passos.length - 1) : 1);
  const num = $('.passo__n', passos[n - 1]);
  if (num && !reduzido) num.animate([{ transform: 'perspective(200px) rotateY(-180deg) scale(.85)' }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  medalha?.noPasso(n);
}
if (lista) {
  const io = new IntersectionObserver(() => {
    let n = 0;
    passos.forEach((li, i) => { if (li.getBoundingClientRect().top < innerHeight * 0.62) n = i + 1; });
    if (n) ativa(n);
  }, { rootMargin: '0px', threshold: [0, .25, .5, .75, 1] });
  passos.forEach(li => io.observe(li));
  addEventListener('scroll', () => {
    let n = 0;
    passos.forEach((li, i) => { if (li.getBoundingClientRect().top < innerHeight * 0.62) n = i + 1; });
    if (n && n !== ativo) ativa(n);
  }, { passive: true });
  if (mouse) passos.forEach((li, i) => li.addEventListener('pointerenter', () => ativa(i + 1)));
}

/* ================================================================ medalha 3D com a logo */
// Um disco com espessura de metal: gira devagar e flutua; no passo 3 assenta de frente com um leve balanço;
// um toque vira para o verso (OAB). O reflexo de luz e a sombra acompanham o giro. Tudo com mola, interrompível.
const medalha = (() => {
  const botao = $('[data-medalha]'), corpo = $('[data-corpo]'), sombra = $('[data-sombra]');
  if (!botao || !corpo) return null;
  const VEL = 32;                       // graus por segundo no giro livre
  let ang = -24, vel = 0, modo = reduzido ? 'parado' : 'gira', alvo = 0, verso = false;
  let tx = 0, ty = 0, ix = 0, iy = 0, t0 = performance.now(), raf = 0, visivel = false;
  const perto = (a, base) => base + Math.round((a - base) / 360) * 360;   // a volta inteira mais próxima
  const desenha = agora => {
    const dt = Math.min(0.05, (agora - t0) / 1000); t0 = agora;
    if (modo === 'gira') { vel += (VEL - vel) * Math.min(1, dt * 2.2); ang += vel * dt; }
    else if (modo === 'mola') {       // rigidez 60, amortecimento 9: assenta em ~0,8 s com um leve balanço
      const f = (alvo - ang) * 60 - vel * 9; vel += f * dt; ang += vel * dt;
      if (Math.abs(alvo - ang) < 0.05 && Math.abs(vel) < 0.5) { ang = alvo; vel = 0; modo = 'parado'; }
    }
    ix += (tx - ix) * Math.min(1, dt * 8); iy += (ty - iy) * Math.min(1, dt * 8);
    const boia = reduzido ? 0 : Math.sin(agora / 900) * 6;
    corpo.style.transform = `translateY(${boia.toFixed(2)}px) rotateX(${(8 + iy).toFixed(2)}deg) rotateY(${(ang + ix).toFixed(2)}deg)`;
    const vis = ((ang % 360) + 360) % 360;
    corpo.style.setProperty('--luz', `${(50 + Math.sin(vis * Math.PI / 180) * 60).toFixed(1)}%`);
    if (sombra) sombra.style.setProperty('--sombra', (0.55 + 0.45 * Math.abs(Math.cos(vis * Math.PI / 180))).toFixed(3));
    const segue = visivel && !reduzido;
    raf = segue ? requestAnimationFrame(desenha) : 0;
  };
  const liga = () => { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(desenha); } };
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) liga(); }).observe(botao);
  const assenta = lado => {
    verso = lado; alvo = perto(ang, lado ? 180 : 0);
    botao.setAttribute('aria-pressed', String(lado));
    if (reduzido) { ang = alvo; modo = 'parado'; desenha(performance.now()); return; }
    modo = 'mola'; liga();
  };
  botao.addEventListener('click', () => assenta(modo === 'gira' ? true : !verso));
  if (mouse && !reduzido) {
    botao.parentElement.addEventListener('pointermove', e => {
      const r = botao.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / r.width)) * 18;
      ty = -Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / r.height)) * 14;
      liga();
    });
    botao.parentElement.addEventListener('pointerleave', () => { tx = 0; ty = 0; liga(); });
  }
  if (reduzido) { ang = 0; desenha(performance.now()); }
  return {
    noPasso(n) {
      if (n === 3) assenta(false);                                         // a orientação chegou: de frente
      else if (!reduzido && modo !== 'gira' && !verso) { modo = 'gira'; liga(); }
    },
  };
})();

/* ================================================================ barra de WhatsApp no celular */
const barra = $('[data-barra]');
if (barra) {
  const final = $('.final') || $('.rodape');
  let depoisDoTopo = !hero, finalVisivel = false;
  const atualiza = () => barra.classList.toggle('is-visivel', depoisDoTopo && !finalVisivel);
  if (hero) new IntersectionObserver(([e]) => { depoisDoTopo = !e.isIntersecting; atualiza(); }).observe($('.hero__acoes') || hero);
  if (final) new IntersectionObserver(([e]) => { finalVisivel = e.isIntersecting; atualiza(); }).observe(final);
  atualiza();
}

/* ================================================================ cookies e analytics (LGPD) */
const guarda = {
  ler() { try { return localStorage.getItem(CHAVE_COOKIES); } catch { return null; } },
  gravar(v) { try { localStorage.setItem(CHAVE_COOKIES, v); } catch { /* sem armazenamento: o banner volta na próxima visita */ } },
};
function carregaAnalytics() {
  if (!/^G-[A-Z0-9]+$/.test(GA_ID) || window.__bmGA) return;
  window.__bmGA = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}
function mostraBanner() {
  if ($('.cookies')) return;
  const el = document.createElement('section');
  el.className = 'cookies'; el.setAttribute('aria-label', 'Aviso de cookies');
  el.innerHTML = `<p>Este site usa cookies de medição de audiência (Google Analytics) só se você permitir, para saber quantas pessoas o visitam. Nada do que você conta à advogada passa por eles. Veja a <a href="privacidade.html#cookies">Política de Privacidade</a>.</p>
    <div class="cookies__acoes"><button type="button" class="btn btn--ouro" data-cookies="aceito">Aceitar cookies</button><button type="button" class="btn btn--contorno" data-cookies="recusado">Recusar</button></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => {
    const escolha = e.target.closest('[data-cookies]')?.dataset.cookies;
    if (!escolha) return;
    guarda.gravar(escolha);
    if (escolha === 'aceito') carregaAnalytics();
    el.classList.add('is-fechando'); setTimeout(() => el.remove(), 160);
  });
}
const escolhaCookies = guarda.ler();
if (escolhaCookies === 'aceito') carregaAnalytics(); else if (!escolhaCookies) mostraBanner();
document.addEventListener('click', e => { if (e.target.closest('[data-cookies-prefs]')) { e.preventDefault(); mostraBanner(); } });

/* ================================================================ formulário: erros e envio pelo WhatsApp */
const form = $('#form-mensagem');
if (form) {
  const status = $('[data-status]', form);
  const regras = {
    nome: v => v.trim().length >= 2,
    telefone: v => v.replace(/\D/g, '').length >= 10,
    assunto: v => v !== '',
    mensagem: v => v.trim().length >= 10,
    consentimento: (v, el) => el.checked,
  };
  const campos = $$('input, select, textarea', form);
  const confere = el => {
    const ok = regras[el.name] ? regras[el.name](el.value, el) : true;
    const erro = document.getElementById(el.getAttribute('aria-describedby'));
    el.toggleAttribute('aria-invalid', !ok);
    if (!ok) el.setAttribute('aria-invalid', 'true');
    if (erro) erro.hidden = ok;
    return ok;
  };
  // um campo marcado com erro se corrige enquanto a pessoa digita
  campos.forEach(el => el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid') === 'true') confere(el); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ruins = campos.filter(el => !confere(el));
    if (ruins.length) {
      status.textContent = ruins.length === 1 ? 'Corrija o campo destacado.' : `Corrija os ${ruins.length} campos destacados.`;
      ruins[0].focus();
      return;
    }
    status.textContent = '';
    const d = new FormData(form);
    const texto = ['Olá, Bruna. Vim pelo site.', `Nome: ${d.get('nome')}`, `WhatsApp: ${d.get('telefone')}`, `Assunto: ${d.get('assunto')}`, `Mensagem: ${d.get('mensagem')}`].join('\n');
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
    try { sessionStorage.setItem('bm-whatsapp', url); } catch { /* a página de obrigado usa o link geral */ }
    window.open(url, '_blank', 'noopener');
    location.href = 'obrigado.html';
  });
}
const reabre = $('[data-reabre-whatsapp]');
if (reabre) { try { const u = sessionStorage.getItem('bm-whatsapp'); if (u) reabre.href = u; } catch { /* fica o link geral */ } }
