// O movimento próprio do site da Bruna Mattos (o kit cuida de botões, links, entrada do topo e do retrato em Sobre).
// Regras: só anima o que informa ou responde ao visitante; curvas ease-out fortes; nada se move para quem pediu
// menos movimento no sistema, e nada de inclinação em telas de toque.

const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
const mouse = matchMedia('(hover: hover) and (pointer: fine)');
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const anima = () => !reduzido.matches;

/* ---------------------------------------------------------------- a balança 3D */
// Celular ou conexão lenta: a imagem parada, sem baixar o código 3D. Nos outros casos a balança acompanha os
// passos: em três quartos e oscilando nos passos 1 e 2; no passo 3 ("Você recebe a orientação") ela vira de
// frente, com os pratos nivelados, e para. Voltar ao passo 2 devolve o movimento.
const balanca = document.getElementById('balanca');
let ctrl = null, pausamos = false, deFrente = false, espera = 0;

async function montaBalanca() {
  if (!balanca) return;
  const c = navigator.connection || {};
  const lento = c.saveData || /(^|-)(2g|3g)$/.test(c.effectiveType || '');
  const celular = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  if (lento || celular) {
    const img = new Image();
    img.className = 'balanca-still'; img.alt = balanca.getAttribute('aria-label'); img.loading = 'lazy'; img.decoding = 'async';
    img.src = 'assets/objects/product-render/specs/stills/balanca-three-quarter-navy-half.webp';
    balanca.removeAttribute('data-product'); balanca.removeAttribute('aria-label'); balanca.appendChild(img);
    return;
  }
  const { products, ready } = await import('./objects/product-render/auto.js');
  await ready;
  ctrl = products.get(balanca);
  if (!ctrl) return;
  // o botão de pausa do kit vem em inglês: o leitor de tela passa a anunciar em português
  const traduz = () => balanca.querySelectorAll('button[aria-label]').forEach(b => {
    const t = b.getAttribute('aria-label');
    const n = /^Pause\b/.test(t) ? 'Pausar a animação da balança' : /^(Play|Resume)\b/.test(t) ? 'Retomar a animação da balança' : t;
    if (n !== t) b.setAttribute('aria-label', n);
  });
  traduz();
  new MutationObserver(traduz).observe(balanca, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-label'] });
  balancaNoPasso(passoAtivo);
}

// a vista troca por um esmaecimento curto do próprio kit; a pausa espera a troca terminar
function balancaNoPasso(n) {
  if (!ctrl) return;
  clearTimeout(espera);
  const frente = n === 3;
  if (frente === deFrente) return;
  deFrente = frente;
  ctrl.setView(frente ? 'side' : 'three-quarter');
  if (frente) espera = setTimeout(() => { ctrl.pause(); pausamos = true; }, anima() ? 700 : 0);
  else if (pausamos) { ctrl.resume(); pausamos = false; }   // só retoma o que este código pausou
}

/* ---------------------------------------------------------------- os 3 passos */
// O passo que cruza o meio da tela fica ativo (ou o que o mouse ou o teclado apontam): o número vira uma moeda
// que gira uma vez em 3D, a linha de progresso desce até ele e a balança gira para o mesmo passo.
const lista = document.querySelector('[data-steps]');
const passos = lista ? [...lista.querySelectorAll('.step')] : [];
let passoAtivo = 0;

function ativa(n) {
  if (n === passoAtivo || !lista) return;
  const subiu = n > passoAtivo;
  passoAtivo = n;
  lista.classList.add('is-live');
  passos.forEach((li, i) => {
    li.classList.toggle('is-active', i + 1 === n);
    li.classList.toggle('is-done', i + 1 < n);
  });
  lista.style.setProperty('--p', passos.length > 1 ? (n - 1) / (passos.length - 1) : 1);
  const moeda = passos[n - 1]?.querySelector('.step__n');
  if (moeda && subiu && anima()) {
    moeda.animate(
      [{ transform: 'perspective(240px) rotateY(-180deg) scale(0.9)' }, { transform: 'perspective(240px) rotateY(0) scale(1)' }],
      { duration: 520, easing: EASE_OUT }
    );
  }
  balancaNoPasso(n);
}

if (lista) {
  const visiveis = new Map();
  const io = new IntersectionObserver(es => {
    es.forEach(e => visiveis.set(e.target, e.isIntersecting));
    // o passo mais baixo que já passou pela faixa do meio da tela
    let n = 0;
    passos.forEach((li, i) => { if (visiveis.get(li) || li.getBoundingClientRect().bottom < innerHeight * 0.45) n = i + 1; });
    if (n) ativa(n);
  }, { rootMargin: '-45% 0px -45% 0px' });
  passos.forEach(li => io.observe(li));
  // apontar com o mouse ou focar também ativa o passo
  passos.forEach((li, i) => {
    li.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') ativa(i + 1); });
  });
}

/* ---------------------------------------------------------------- inclinação 3D com mola */
// Decorativa e rara: segue o mouse com uma mola (velocidade e amortecimento), nunca na posição crua do cursor.
// Só com mouse, nunca com reduzir movimento.
function inclina(el, { max = 3, lift = 0, perspectiva = 900 } = {}) {
  let alvoX = 0, alvoY = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, dentro = false;
  const K = 0.12, AMORTECE = 0.72;   // rigidez e amortecimento: assenta em ~0,5 s, sem quicar
  const quadro = () => {
    vx = (vx + (alvoX - x) * K) * AMORTECE; vy = (vy + (alvoY - y) * K) * AMORTECE;
    x += vx; y += vy;
    const parado = Math.abs(alvoX - x) < 0.01 && Math.abs(alvoY - y) < 0.01 && Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01;
    if (parado && !dentro) { el.style.transform = ''; raf = 0; return; }
    el.style.transform = `perspective(${perspectiva}px) translateY(${lift}px) rotateX(${y.toFixed(3)}deg) rotateY(${x.toFixed(3)}deg)`;
    raf = requestAnimationFrame(quadro);
  };
  const liga = () => { if (!raf) raf = requestAnimationFrame(quadro); };
  el.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !mouse.matches || !anima()) return;
    const r = el.getBoundingClientRect();
    alvoX = ((e.clientX - r.left) / r.width - 0.5) * 2 * max;
    alvoY = -((e.clientY - r.top) / r.height - 0.5) * 2 * max;
    dentro = true; liga();
  });
  el.addEventListener('pointerleave', () => { alvoX = 0; alvoY = 0; dentro = false; liga(); });
}

if (anima() && mouse.matches) {
  // cards de serviço: até 3°, com a subida de 2px do kit embutida
  document.querySelectorAll('#servicos .card').forEach(card => inclina(card, { max: 3, lift: -2 }));
  // retrato do topo: só 2°, profundidade sutil
  const retrato = document.querySelector('.hero__media');
  if (retrato) inclina(retrato, { max: 2, perspectiva: 1400 });
}

montaBalanca();
