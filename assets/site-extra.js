// Partes do site da Bruna Mattos que não vêm do kit: banner de cookies e analytics (só com consentimento, LGPD),
// fim da tela de carregamento e o formulário que prepara a mensagem no WhatsApp.

/* ================================================================ CONFIGURAÇÃO */
// GOOGLE ANALYTICS 4: cole aqui o ID de medição (formato G-XXXXXXXXXX). Vazio = nenhum analytics é carregado.
const GA_ID = '';
const WHATSAPP = '559591367145';
const CHAVE_COOKIES = 'bm-cookies';   // guarda "aceito" ou "recusado" no navegador do visitante

/* ================================================================ tela de carregamento */
const carregando = document.querySelector('.carregando');
if (carregando) {
  const some = () => { carregando.classList.add('is-done'); setTimeout(() => carregando.remove(), 300); };
  const limite = setTimeout(some, 700);   // nunca segura a página mais que 0,7 s
  Promise.all([document.fonts?.ready, new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))])
    .then(() => { clearTimeout(limite); some(); });
}

/* ================================================================ cookies e analytics */
const guarda = {
  ler() { try { return localStorage.getItem(CHAVE_COOKIES); } catch { return null; } },
  gravar(v) { try { localStorage.setItem(CHAVE_COOKIES, v); } catch { /* navegador sem armazenamento: o banner volta na próxima visita */ } },
};

function carregaAnalytics() {
  if (!/^G-[A-Z0-9]+$/.test(GA_ID) || window.__bmGA) return;
  window.__bmGA = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function mostraBanner() {
  if (document.querySelector('.cookies')) return;
  const el = document.createElement('section');
  el.className = 'cookies';
  el.setAttribute('aria-label', 'Aviso de cookies');
  el.innerHTML = `
    <p>Este site usa cookies de medição de audiência (Google Analytics) só se você permitir, para saber quantas pessoas o visitam. Nenhum dado do que você conta à advogada passa por eles. Veja a <a href="privacidade.html#cookies">Política de Privacidade</a>.</p>
    <div class="cookies__acoes">
      <button type="button" class="btn btn--primary" data-cookies="aceito">Aceitar cookies</button>
      <button type="button" class="btn btn--secondary" data-cookies="recusado">Recusar</button>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => {
    const escolha = e.target.closest('[data-cookies]')?.dataset.cookies;
    if (!escolha) return;
    guarda.gravar(escolha);
    if (escolha === 'aceito') carregaAnalytics();
    el.classList.add('is-closing');
    setTimeout(() => el.remove(), 160);
  });
}

const escolha = guarda.ler();
if (escolha === 'aceito') carregaAnalytics();
else if (!escolha) mostraBanner();
// "Preferências de cookies" no rodapé reabre o banner
document.addEventListener('click', e => {
  if (e.target.closest('[data-cookies-prefs]')) { e.preventDefault(); mostraBanner(); }
});

/* ================================================================ formulário → WhatsApp */
// O kit (system.js) valida primeiro e mostra o erro embaixo de cada campo. Se tudo estiver certo, a mensagem é
// montada, o WhatsApp da Bruna abre com ela pronta e o visitante vai para a página de obrigado. Nada vai na URL.
const form = document.getElementById('form-mensagem');
if (form) {
  form.addEventListener('submit', e => {
    if (e.defaultPrevented) return;   // o kit encontrou erros
    e.preventDefault();
    const d = new FormData(form);
    const texto = [
      'Olá, Bruna. Vim pelo site.',
      `Nome: ${d.get('nome')}`,
      `WhatsApp: ${d.get('telefone')}`,
      `Assunto: ${d.get('assunto')}`,
      `Mensagem: ${d.get('mensagem')}`,
    ].join('\n');
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
    try { sessionStorage.setItem('bm-whatsapp', url); } catch { /* sem armazenamento: a página de obrigado usa o link geral */ }
    window.open(url, '_blank', 'noopener');
    location.href = 'obrigado.html';
  });
}

// página de obrigado: o botão reabre a mesma mensagem, caso o WhatsApp não tenha aberto
const reabre = document.querySelector('[data-reabre-whatsapp]');
if (reabre) { try { const u = sessionStorage.getItem('bm-whatsapp'); if (u) reabre.href = u; } catch { /* fica o link geral */ } }
