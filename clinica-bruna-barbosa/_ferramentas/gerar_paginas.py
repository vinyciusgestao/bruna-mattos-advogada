"""Gera as páginas HTML da Clínica Bruna Barbosa a partir de partes comuns.

Uso (na raiz do repositório):  python3 clinica-bruna-barbosa/_ferramentas/gerar_paginas.py
Edite os textos aqui e rode de novo; os .html da pasta são sobrescritos.
"""
from pathlib import Path
import json

PASTA = Path(__file__).resolve().parent.parent
BASE = "https://vinyciusgestao.github.io/bruna-mattos-advogada/clinica-bruna-barbosa/"
HOJE = "2026-11-11"
NOME = "Clínica Bruna Barbosa"
ENDERECO = "Rua Pernambuco, 345 – Jardim Vitória, Itabuna (BA), CEP 45605-510"
MAPA_Q = "Rua+Pernambuco,+345,+Jardim+Vit%C3%B3ria,+Itabuna+-+BA,+45605-510"
IG = "https://www.instagram.com/clinicabrunabarbosa/"

IC = {
    "wa": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9 9.5c.3 1.8 2 3.9 4.2 4.6l1.1-1.1 1.7.8-.4 1.4c-3.2.2-6.9-3.2-7.1-6.3l1.4-.5.8 1.7Z"/></svg>',
    "cal": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8.5 14.5l2 2 4-4"/></svg>',
    "ig": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r=".9" fill="currentColor"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
    "tel": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    "relogio": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    "girar": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/></svg>',
    "esq": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    "dir": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    "x": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    "ok": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    # ícones dos tratamentos
    "medida": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h18v8H3z"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>',
    "gota": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
    "maos": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10M10 9.5V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 6 17.4L4 13.5a1.5 1.5 0 0 1 2.6-1.5L8 14"/></svg>',
    "onda": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1 4-.5M3 13c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1 4-.5M3 18c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1 4-.5"/></svg>',
    "rosto": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c4 0 6.5 3 6.5 7.5S15.5 21 12 21s-6.5-6-6.5-10.5S8 3 12 3Z"/><path d="M9.5 10.5h.01M14.5 10.5h.01M10 15c1.2.9 2.8.9 4 0"/></svg>',
    "brilho": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3-2.3-1.2 2.3-1.2z"/><path d="m5.6 5.6 1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/></svg>',
}

LOGO = '''<svg class="marca__logo" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg-ouro{s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecd7a8"/><stop offset=".5" stop-color="#c19a5b"/><stop offset="1" stop-color="#9c7238"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="#3a2723"/><circle cx="32" cy="32" r="26.5" fill="none" stroke="url(#lg-ouro{s})" stroke-width="1.6"/><text x="32" y="41" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="26" font-weight="600" fill="url(#lg-ouro{s})" letter-spacing="-1">BB</text><path d="M47 14.5l1.1 2.6 2.6 1.1-2.6 1.1-1.1 2.6-1.1-2.6-2.6-1.1 2.6-1.1z" fill="#ecd7a8"/></svg>'''


def logo(s=""):
    return LOGO.replace("{s}", s)


FONTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">'


def head(titulo, descricao, caminho, extra="", indexar=True, og_alt="Clínica Bruna Barbosa, estética corporal e facial em Itabuna (BA)"):
    url = BASE + caminho
    robots = "" if indexar else '<meta name="robots" content="noindex, follow">\n'
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{descricao}">
{robots}<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="{NOME}">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{descricao}">
<meta property="og:image" content="{BASE}assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{og_alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{titulo}">
<meta name="twitter:description" content="{descricao}">
<meta name="twitter:image" content="{BASE}assets/img/og-image.jpg">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#3a2723">
{FONTES}
<link rel="stylesheet" href="assets/css/estilo.css">
<script>document.documentElement.classList.add("js");try{{if(sessionStorage.getItem("cbb-visto")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("sem-carregamento");sessionStorage.setItem("cbb-visto","1")}}catch(e){{}}</script>
<script type="module" src="assets/js/app.js"></script>
{extra}</head>'''


def topo(inicio=""):
    """inicio = '' na home (âncoras locais) ou 'index.html' nas outras páginas."""
    h = inicio
    links = [("#tratamentos", "Tratamentos"), ("#resultados", "Resultados"), ("#relatos", "Relatos"), ("#sobre", "A clínica"), ("#contato", "Contato")]
    menu = "".join(f'<a href="{h}{a}">{t}</a>' for a, t in links)
    return f'''
<body{' class="interna"' if inicio else ''}>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<div class="carregando" aria-hidden="true"><div class="carregando__cena">{logo("c").replace('class="marca__logo"', 'class="carregando__logo"')}<span class="carregando__nome">Clínica Bruna Barbosa</span><span class="carregando__barra"></span></div></div>
<div class="aviso" role="region" aria-label="Agendamento">
  <span><span class="aviso__brilho" aria-hidden="true">✦</span> <span class="aviso__longo">Avaliação personalizada para corpo e rosto em Itabuna.</span> Vagas da semana abertas:</span>
  <a href="{IG}" data-contato data-origem="aviso_topo">Agendar agora →</a>
</div>
<header class="topo" data-topo>
  <div class="wrap topo__barra">
    <a class="marca" href="{h or '#inicio'}" aria-label="Clínica Bruna Barbosa, página inicial">{logo()}<span class="marca__nome">Bruna Barbosa<small>Clínica de estética</small></span></a>
    <nav class="menu" aria-label="Principal">{menu}</nav>
    <a class="btn btn--ouro" href="{IG}" data-contato data-origem="cabecalho">{IC["cal"]}Agendar avaliação</a>
    <button class="topo__menu-btn" type="button" aria-expanded="false" aria-controls="folha" aria-label="Abrir o menu"><span></span></button>
  </div>
</header>
<nav class="folha" id="folha" aria-label="Menu do celular">
  {menu}
  <a class="btn btn--ouro btn--grande" href="{IG}" data-contato data-origem="menu_celular">{IC["cal"]}Agendar avaliação</a>
</nav>'''


def rodape(inicio=""):
    h = inicio
    return f'''
<footer class="rodape">
  <div class="wrap">
    <div class="rodape__grade">
      <div>
        <a class="marca" href="{h or '#inicio'}">{logo("r")}<span class="marca__nome">Bruna Barbosa<small>Clínica de estética</small></span></a>
        <p>Estética corporal e facial em Itabuna (BA), desde 2012. Protocolos personalizados para você conquistar a sua melhor versão.</p>
      </div>
      <div>
        <h3>Visite</h3>
        <ul>
          <li><a href="https://www.google.com/maps/search/?api=1&query={MAPA_Q}" target="_blank" rel="noopener">{ENDERECO}</a></li>
          <li data-telefone-item><a href="#" data-telefone></a></li>
          <li><a href="{IG}" target="_blank" rel="noopener">@clinicabrunabarbosa</a></li>
        </ul>
      </div>
      <div>
        <h3>Navegue</h3>
        <ul>
          <li><a href="{h}#tratamentos">Tratamentos</a></li>
          <li><a href="{h}#resultados">Resultados</a></li>
          <li><a href="{h}#relatos">Relatos em vídeo</a></li>
          <li><a href="privacidade.html">Política de privacidade</a></li>
          <li><a href="termos.html">Termos de uso</a></li>
        </ul>
      </div>
    </div>
    <div class="rodape__base">
      <span>© <span data-ano>2026</span> {NOME} · B. Barbosa Santos Almeida Instituto de Estética · CNPJ 15.228.378/0001-14</span>
      <button type="button" data-abrir-cookies>Preferências de cookies</button>
    </div>
  </div>
</footer>
<div class="cta-fixo" aria-label="Agendamento rápido">
  <a class="btn btn--ouro" href="{IG}" data-contato data-origem="cta_fixo_celular">{IC["cal"]}<span>Agendar pelo <span data-canal>Instagram</span></span></a>
  <a class="btn btn--icone" href="{h}#contato" aria-label="Ver endereço e formulário">{IC["pin"]}</a>
</div>
<section class="cookies" data-cookies aria-labelledby="cookies-h" aria-describedby="cookies-p">
  <h2 id="cookies-h">Cookies, com a sua permissão</h2>
  <p id="cookies-p">Usamos cookies de análise (Google Analytics) para entender como o site é usado e melhorá-lo. Eles só são ativados se você aceitar. Saiba mais na <a href="privacidade.html">Política de privacidade</a>.</p>
  <div class="cookies__acoes">
    <button class="btn btn--contorno" type="button" data-recusar>Recusar</button>
    <button class="btn" type="button" data-aceitar>Aceitar cookies</button>
  </div>
</section>
</body>
</html>
'''


def schema():
    dados = {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        "name": NOME,
        "legalName": "B. Barbosa Santos Almeida Instituto de Estética",
        "taxID": "15.228.378/0001-14",
        "url": BASE,
        "image": BASE + "assets/img/og-image.jpg",
        "logo": BASE + "android-chrome-512x512.png",
        "foundingDate": "2012",
        "sameAs": [IG],
        "address": {"@type": "PostalAddress", "streetAddress": "Rua Pernambuco, 345", "addressLocality": "Itabuna", "addressRegion": "BA", "postalCode": "45605-510", "addressCountry": "BR"},
        "areaServed": "Itabuna e região (BA)",
        "makesOffer": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": n}} for n in ["Redução de medidas", "Drenagem linfática", "Massagem modeladora", "Tratamento de celulite e flacidez", "Limpeza de pele", "Estética facial"]],
    }
    return '<script type="application/ld+json">' + json.dumps(dados, ensure_ascii=False) + "</script>\n"


TRATAMENTOS = [
    ("medida", "Corpo", "Redução de medidas", "Protocolos que combinam técnicas manuais e tecnologias para tratar a gordura localizada de abdômen, flancos, culote e braços.",
     ["Gordura localizada", "Medidas que não cedem com dieta e treino", "Quem quer acelerar resultados"],
     "Avaliação com fotos e fita métrica, plano de sessões montado para a sua região e reavaliação periódica para acompanhar a evolução.",
     "Olá! Vim pelo site e quero saber sobre o protocolo de redução de medidas."),
    ("gota", "Corpo", "Drenagem linfática", "Técnica manual suave que estimula a circulação da linfa e ajuda a desinchar. Também indicada no pós-operatório, com liberação médica.",
     ["Inchaço e retenção de líquido", "Sensação de pernas pesadas", "Pós-operatório de cirurgia plástica"],
     "Movimentos lentos e ritmados, sem dor. No pós-operatório, a frequência segue a orientação do seu cirurgião.",
     "Olá! Vim pelo site e quero agendar uma drenagem linfática."),
    ("maos", "Corpo", "Massagem modeladora", "Manobras firmes e rápidas que trabalham o contorno do corpo e ajudam a melhorar o aspecto de gordura localizada.",
     ["Contorno corporal", "Complemento de protocolos de redução", "Quem gosta de massagem intensa"],
     "Sessões focadas nas regiões que você quer modelar, combinadas a outros recursos quando faz sentido para o seu objetivo.",
     "Olá! Vim pelo site e quero saber sobre massagem modeladora."),
    ("onda", "Corpo", "Celulite e flacidez", "Tratamentos para melhorar a textura da pele, a firmeza e o aspecto da celulite em glúteos, coxas, abdômen e braços.",
     ["Celulite em diferentes graus", "Pele flácida após emagrecimento", "Estrias e textura irregular"],
     "Classificamos o grau da celulite e da flacidez na avaliação e indicamos a combinação de técnicas e o número de sessões.",
     "Olá! Vim pelo site e quero tratar celulite e flacidez."),
    ("rosto", "Rosto", "Limpeza de pele", "Higienização profunda, extração de cravos, esfoliação e hidratação para uma pele mais limpa, uniforme e luminosa.",
     ["Cravos, espinhas e oleosidade", "Poros dilatados", "Pele opaca ou desidratada"],
     "Análise da pele, limpeza, extração cuidadosa e finalização com máscara e protetor solar, além de orientações de cuidado em casa.",
     "Olá! Vim pelo site e quero agendar uma limpeza de pele."),
    ("brilho", "Rosto e corpo", "Estética avançada", "Recursos tecnológicos e protocolos faciais e corporais indicados de acordo com a sua avaliação, para potencializar os resultados.",
     ["Quem busca resultados em menos sessões", "Rejuvenescimento facial", "Tratamentos combinados"],
     "Na avaliação, explicamos quais tecnologias são indicadas para o seu caso, os cuidados e as contraindicações.",
     "Olá! Vim pelo site e quero conhecer os tratamentos de estética avançada."),
]

DUVIDAS = [
    ("Como funciona a avaliação?", "Na avaliação conversamos sobre o seu objetivo, histórico de saúde e rotina, analisamos a região a ser tratada e registramos medidas e fotos (só com a sua autorização). A partir disso, montamos um protocolo personalizado com o número de sessões indicado."),
    ("Em quantas sessões vejo resultado?", "Depende do tratamento, da região e do seu organismo. Muitas clientes já percebem diferença nas primeiras sessões, mas o resultado completo vem com o protocolo inteiro e com hábitos como alimentação, hidratação e atividade física. Na avaliação damos uma estimativa para o seu caso."),
    ("Os procedimentos doem?", "A drenagem linfática e a limpeza de pele são confortáveis. A massagem modeladora é mais intensa, e a pressão é ajustada para você. Avisamos antes de cada etapa o que você vai sentir."),
    ("Atendem pós-operatório?", "Sim. A drenagem linfática pós-operatória é feita com a liberação do seu cirurgião, seguindo a frequência que ele orientar. Traga as recomendações médicas na primeira sessão."),
    ("Quais formas de pagamento?", "Os valores dependem do protocolo indicado na avaliação. Fale com a clínica pelo Instagram ou WhatsApp para conhecer as formas de pagamento e os pacotes disponíveis."),
    ("Onde fica a clínica?", f"Estamos na {ENDERECO}. O mapa logo abaixo mostra o caminho."),
]


def index():
    cards = ""
    for i, (ic, tag, tit, desc, indicado, sessao, msg) in enumerate(TRATAMENTOS):
        lis = "".join(f"<li>{x}</li>" for x in indicado)
        cards += f'''
        <article class="trat" data-trat data-revela style="--i:{i % 3}">
          <div class="trat__giro">
            <div class="trat__face trat__frente" data-inclina="6">
              <div class="trat__icone">{IC[ic]}</div>
              <p class="trat__tag">{tag}</p>
              <h3>{tit}</h3>
              <p>{desc}</p>
              <div class="trat__acoes">
                <a class="btn" href="{IG}" data-contato data-msg="{msg}" data-origem="tratamento">Agendar</a>
                <button class="virar" type="button" aria-expanded="false" data-virar>{IC["girar"]}Para quem é</button>
              </div>
            </div>
            <div class="trat__face trat__verso">
              <h4>Indicado para</h4>
              <ul>{lis}</ul>
              <h4>Como é a sessão</h4>
              <p>{sessao}</p>
              <div class="trat__acoes">
                <a class="btn btn--ouro" href="{IG}" data-contato data-msg="{msg}" data-origem="tratamento_verso">Quero esse</a>
                <button class="virar" type="button" aria-expanded="true" data-virar>{IC["girar"]}Voltar</button>
              </div>
            </div>
          </div>
        </article>'''
    duvidas = "".join(f'''
      <div class="pergunta" data-pergunta data-revela>
        <h3 style="margin:0"><button type="button" aria-expanded="false" aria-controls="r{i}" id="p{i}">{q}<i aria-hidden="true"></i></button></h3>
        <div class="pergunta__resp" id="r{i}" role="region" aria-labelledby="p{i}"><div><p>{a}</p></div></div>
      </div>''' for i, (q, a) in enumerate(DUVIDAS))
    opcoes = "".join(f"<option>{t[2]}</option>" for t in TRATAMENTOS) + "<option>Ainda não sei, quero uma avaliação</option>"
    faixa = "".join(f"<li>{x}</li>" for x in ["Redução de medidas", "Drenagem linfática", "Massagem modeladora", "Celulite", "Flacidez", "Pós-operatório", "Limpeza de pele", "Estética facial", "Gordura localizada"])

    corpo = f'''
<main id="conteudo" tabindex="-1">
  <section class="hero" id="inicio" aria-labelledby="hero-h">
    <div class="hero__cena" data-cena3d></div>
    <div class="hero__fallback" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="wrap hero__grade">
      <div>
        <p class="eyebrow entra" style="--i:0">Estética corporal e facial · Itabuna (BA)</p>
        <h1 id="hero-h" class="entra" style="--i:1">Sua melhor versão, <em>sessão a sessão.</em></h1>
        <p class="lead entra" style="--i:2">Desde 2012, a Clínica Bruna Barbosa cuida do corpo e da pele de quem quer resultado de verdade: redução de medidas, drenagem, modelagem, celulite, flacidez e limpeza de pele, com protocolos pensados para você.</p>
        <div class="hero__acoes entra" style="--i:3">
          <a class="btn btn--ouro btn--grande" href="{IG}" data-contato data-origem="hero">{IC["cal"]}Agendar minha avaliação</a>
          <a class="btn btn--contorno btn--grande" href="#resultados">Ver resultados</a>
        </div>
        <ul class="numeros entra" style="--i:4" aria-label="A clínica em números">
          <li><strong><span data-conta="{2026 - 2012}">{2026 - 2012}</span></strong><span>anos em Itabuna</span></li>
          <li><strong><span data-conta="32" data-sufixo=" mil">32 mil</span></strong><span>seguidores no Instagram</span></li>
          <li><strong><span data-conta="2500" data-sufixo="+">2.500+</span></strong><span>publicações de cuidados</span></li>
        </ul>
      </div>
      <aside class="hero__cartao entra" style="--i:5" data-inclina="10" aria-labelledby="cartao-h">
        <h2 id="cartao-h">Avaliação personalizada</h2>
        <p>Antes de qualquer sessão, entendemos o seu objetivo e montamos o plano ideal.</p>
        <ul><li>Análise da região e medidas</li><li>Protocolo sob medida</li><li>Acompanhamento da evolução</li></ul>
        <a class="btn btn--rose" href="{IG}" data-contato data-origem="cartao_hero" style="width:100%">Quero agendar</a>
      </aside>
    </div>
    <span class="rolar" aria-hidden="true"></span>
  </section>

  <div class="faixa" aria-hidden="true"><div class="faixa__trilho"><ul>{faixa}</ul><ul>{faixa}</ul></div></div>

  <section class="secao" id="tratamentos" aria-labelledby="trat-h">
    <div class="wrap">
      <div class="cabeca">
        <p class="eyebrow" data-revela>Tratamentos</p>
        <h2 class="titulo" id="trat-h" data-revela style="--i:1">Cuidado completo para o <em>corpo</em> e para o <em>rosto</em>.</h2>
        <p class="lead" data-revela style="--i:2">Toque em “Para quem é” para virar o cartão e ver as indicações. O botão de agendar já leva a mensagem com o tratamento escolhido.</p>
      </div>
      <div class="tratamentos">{cards}
      </div>
    </div>
  </section>

  <section class="secao resultados" id="resultados" aria-labelledby="res-h">
    <div class="wrap">
      <div class="cabeca cabeca--centro">
        <p class="eyebrow" data-revela>Resultados reais</p>
        <h2 class="titulo" id="res-h" data-revela style="--i:1">Arraste e veja a <em>diferença</em>.</h2>
        <p class="lead" data-revela style="--i:2">Antes e depois de clientes da clínica, publicados com autorização. Deslize a linha central para comparar.</p>
      </div>
      <div class="galeria" data-galeria></div>
      <p class="aviso-legal">Os resultados variam de pessoa para pessoa e dependem do protocolo indicado, do número de sessões e dos hábitos de cada cliente. As imagens são de clientes reais e foram publicadas com autorização.</p>
    </div>
  </section>

  <section class="secao relatos" id="relatos" aria-labelledby="rel-h">
    <div class="wrap">
      <div class="cabeca cabeca--centro">
        <p class="eyebrow" data-revela>Relatos em vídeo</p>
        <h2 class="titulo" id="rel-h" data-revela style="--i:1">Quem viveu, <em>conta</em>.</h2>
        <p class="lead" data-revela style="--i:2">Gire o carrossel com as setas, arrastando ou pelo teclado, e toque no vídeo da frente para assistir.</p>
      </div>
      <div class="carrossel" data-carrossel role="region" aria-roledescription="carrossel" aria-label="Relatos em vídeo de clientes" tabindex="0">
        <div class="carrossel__anel"></div>
        <div class="carrossel__ctrl">
          <button class="seta" type="button" data-ant aria-label="Relato anterior">{IC["esq"]}</button>
          <div class="pontos"></div>
          <button class="seta" type="button" data-prox aria-label="Próximo relato">{IC["dir"]}</button>
        </div>
      </div>
      <div class="relatos__rodape"><a class="btn btn--claro" href="{IG}reels/" target="_blank" rel="noopener">{IC["ig"]}Ver todos no Instagram</a></div>
    </div>
  </section>

  <section class="secao" id="como" aria-labelledby="como-h">
    <div class="wrap">
      <div class="cabeca">
        <p class="eyebrow" data-revela>Como funciona</p>
        <h2 class="titulo" id="como-h" data-revela style="--i:1">Do primeiro contato ao <em>resultado</em>, em quatro passos.</h2>
      </div>
      <ol class="passos">
        <li class="passo" data-revela data-inclina style="--i:0"><span class="passo__n">1</span><h3>Fale com a gente</h3><p>Mande uma mensagem pelo botão de agendar ou pelo formulário e escolha o melhor horário.</p></li>
        <li class="passo" data-revela data-inclina style="--i:1"><span class="passo__n">2</span><h3>Avaliação</h3><p>Entendemos seu objetivo, analisamos a região e registramos medidas para comparar depois.</p></li>
        <li class="passo" data-revela data-inclina style="--i:2"><span class="passo__n">3</span><h3>Protocolo</h3><p>Você recebe um plano com as técnicas e o número de sessões indicados para o seu caso.</p></li>
        <li class="passo" data-revela data-inclina style="--i:3"><span class="passo__n">4</span><h3>Evolução</h3><p>Reavaliamos ao longo do tratamento para ajustar o plano e acompanhar cada conquista.</p></li>
      </ol>
    </div>
  </section>

  <section class="secao" id="sobre" aria-labelledby="sobre-h" style="background:var(--creme-2)">
    <div class="wrap sobre__grade">
      <div class="cubo-cena" aria-hidden="true">
        <div class="cubo">
          <div class="cubo__face"><div><strong>Desde 2012</strong><span>cuidando de Itabuna</span></div></div>
          <div class="cubo__face"><div><strong>Corpo</strong><span>medidas, celulite e flacidez</span></div></div>
          <div class="cubo__face"><div><strong>Rosto</strong><span>limpeza e estética facial</span></div></div>
          <div class="cubo__face"><div><strong>Sob medida</strong><span>protocolo para você</span></div></div>
          <div class="cubo__face"><div><strong>✦</strong></div></div>
          <div class="cubo__face"><div><strong>✦</strong></div></div>
        </div>
      </div>
      <div>
        <p class="eyebrow" data-revela>A clínica</p>
        <h2 class="titulo" id="sobre-h" data-revela style="--i:1">Um espaço feito para você se <em>cuidar sem pressa</em>.</h2>
        <p class="lead" data-revela style="--i:2">A Clínica Bruna Barbosa nasceu em Itabuna com um propósito simples: ajudar cada cliente a alcançar a melhor versão de si, com atendimento próximo, técnica e resultados que aparecem no espelho.</p>
        <ul class="lista-check" data-revela style="--i:3">
          <li>Atendimento individual, com hora marcada</li>
          <li>Protocolos combinados conforme o seu objetivo</li>
          <li>Medidas e fotos para acompanhar a evolução</li>
          <li>Orientações de cuidados para casa entre as sessões</li>
        </ul>
        <a class="btn btn--ouro btn--grande" href="{IG}" data-contato data-origem="sobre" data-revela style="--i:4">{IC["cal"]}Agendar uma visita</a>
      </div>
    </div>
  </section>

  <section class="secao" id="duvidas" aria-labelledby="duv-h">
    <div class="wrap">
      <div class="cabeca cabeca--centro">
        <p class="eyebrow" data-revela>Dúvidas frequentes</p>
        <h2 class="titulo" id="duv-h" data-revela style="--i:1">Antes de agendar, <em>tire suas dúvidas</em>.</h2>
      </div>
      <div class="duvidas">{duvidas}
      </div>
    </div>
  </section>

  <section class="secao contato" id="contato" aria-labelledby="cont-h">
    <div class="wrap">
      <div class="cabeca">
        <p class="eyebrow" data-revela>Contato</p>
        <h2 class="titulo" id="cont-h" data-revela style="--i:1">Vamos marcar a sua <em>avaliação</em>?</h2>
        <p class="lead" data-revela style="--i:2">Preencha o formulário e a sua mensagem chega pronta para a equipe da clínica. Se preferir, venha nos visitar.</p>
      </div>
      <div class="contato__grade">
        <div class="cartao" data-revela>
          <ul class="info">
            <li><span class="info__ic">{IC["pin"]}</span><div><strong>Endereço</strong><a href="https://www.google.com/maps/search/?api=1&query={MAPA_Q}" target="_blank" rel="noopener">{ENDERECO}</a></div></li>
            <li data-telefone-item><span class="info__ic">{IC["tel"]}</span><div><strong>Telefone e WhatsApp</strong><a href="#" data-telefone></a></div></li>
            <li><span class="info__ic">{IC["ig"]}</span><div><strong>Instagram</strong><a href="{IG}" target="_blank" rel="noopener">@clinicabrunabarbosa</a></div></li>
            <li><span class="info__ic">{IC["relogio"]}</span><div><strong>Atendimento</strong>Com hora marcada. Consulte os horários disponíveis pela mensagem.</div></li>
          </ul>
          <div class="mapa"><iframe src="https://www.google.com/maps?q={MAPA_Q}&output=embed" title="Mapa com a localização da Clínica Bruna Barbosa na Rua Pernambuco, 345, Jardim Vitória, Itabuna" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        </div>
        <div class="cartao" data-revela style="--i:1">
          <form class="form" data-form novalidate aria-labelledby="form-h">
            <h3 id="form-h" style="font-size:1.8rem;margin:0">Pedir agendamento</h3>
            <p class="form__resumo" role="alert"></p>
            <div class="campo"><label for="f-nome">Nome completo *</label><input id="f-nome" name="nome" autocomplete="name" required aria-describedby="e-nome"><span class="campo__erro" id="e-nome"></span></div>
            <div class="duas">
              <div class="campo"><label for="f-tel">WhatsApp *</label><input id="f-tel" name="telefone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(73) 99999-8888" required aria-describedby="e-tel"><span class="campo__erro" id="e-tel"></span></div>
              <div class="campo"><label for="f-email">E-mail (opcional)</label><input id="f-email" name="email" type="email" autocomplete="email" aria-describedby="e-email"><span class="campo__erro" id="e-email"></span></div>
            </div>
            <div class="campo"><label for="f-int">Tratamento de interesse *</label><select id="f-int" name="interesse" required aria-describedby="e-int"><option value="">Escolha uma opção</option>{opcoes}</select><span class="campo__erro" id="e-int"></span></div>
            <div class="campo"><label for="f-msg">Mensagem (opcional)</label><textarea id="f-msg" name="mensagem" maxlength="600" placeholder="Conte o que você quer melhorar ou o melhor dia para você"></textarea></div>
            <label class="campo campo--check"><input type="checkbox" name="consentimento" aria-describedby="e-cons"><span>Li e aceito a <a href="privacidade.html">Política de privacidade</a> e autorizo o contato da clínica.</span><span class="campo__erro" id="e-cons"></span></label>
            <button class="btn btn--ouro btn--grande" type="submit">{IC["cal"]}Enviar pedido</button>
            <p class="form__nota">Ao enviar, abrimos a conversa com a clínica com os seus dados preenchidos. Nenhum dado fica guardado neste site.</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</main>
<div class="modal" data-modal aria-hidden="true" role="dialog" aria-modal="true" aria-label="Relato em vídeo">
  <div class="modal__caixa"><button class="modal__fechar" type="button" aria-label="Fechar vídeo">{IC["x"]}</button><div data-modal-midia style="height:100%"></div></div>
</div>'''
    return (head("Clínica Bruna Barbosa | Estética corporal e facial em Itabuna (BA)",
                 "Redução de medidas, drenagem linfática, massagem modeladora, celulite, flacidez e limpeza de pele em Itabuna (BA). Veja resultados, relatos e agende sua avaliação.",
                 "", extra=schema()) + topo() + corpo + rodape())


def pagina_texto(arquivo, titulo, descricao, h1, conteudo, indexar=True):
    corpo = f'''
<main id="conteudo" tabindex="-1" class="pagina__corpo">
  <div class="wrap texto-legal">
    <p class="eyebrow">{NOME}</p>
    <h1>{h1}</h1>
    <p class="atualizado">Última atualização: 11 de novembro de 2026.</p>
    {conteudo}
  </div>
</main>'''
    html = head(titulo, descricao, arquivo, indexar=indexar) + topo("index.html") + corpo + rodape("index.html")
    return html.replace('<main id="conteudo" tabindex="-1" class="pagina__corpo">', '<main id="conteudo" tabindex="-1" class="pagina__corpo" style="padding:calc(var(--aviso-h) + var(--topo-h) + 3rem) 0 5rem">')


PRIVACIDADE = f'''
<p>Esta política explica como a {NOME} (B. Barbosa Santos Almeida Instituto de Estética, CNPJ 15.228.378/0001-14, {ENDERECO}) trata dados pessoais de quem visita este site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).</p>
<h2>1. Quais dados coletamos</h2>
<ul>
  <li><strong>Formulário de agendamento:</strong> nome, WhatsApp, e-mail (opcional), tratamento de interesse e mensagem. Esses dados não são armazenados no site: ao enviar, eles são colocados numa mensagem que você mesma envia à clínica pelo WhatsApp ou Instagram.</li>
  <li><strong>Dados de navegação:</strong> se você aceitar os cookies, o Google Analytics coleta informações como páginas visitadas, tempo de permanência, tipo de aparelho, cidade aproximada e origem do acesso, com o IP anonimizado.</li>
  <li><strong>Atendimento:</strong> na avaliação presencial podem ser registrados dados de saúde, medidas e fotos, sempre com o seu consentimento específico e apenas para o seu tratamento.</li>
</ul>
<h2>2. Para que usamos</h2>
<ul><li>Responder ao seu pedido e agendar a avaliação;</li><li>Prestar e acompanhar os tratamentos contratados;</li><li>Entender o uso do site e melhorá-lo (somente com cookies aceitos);</li><li>Cumprir obrigações legais e fiscais.</li></ul>
<h2>3. Fotos e vídeos de clientes</h2>
<p>Imagens de antes e depois e relatos em vídeo só são publicados com autorização expressa e por escrito da cliente, que pode pedir a remoção a qualquer momento.</p>
<h2>4. Cookies</h2>
<p>Usamos apenas cookies de análise (Google Analytics), ativados somente depois que você clica em “Aceitar cookies”. Você pode mudar sua escolha a qualquer momento pelo link “Preferências de cookies” no rodapé. Também guardamos no seu navegador a sua escolha sobre os cookies, para não perguntar de novo.</p>
<h2>5. Compartilhamento</h2>
<p>Não vendemos dados. Eles podem ser tratados por serviços que viabilizam o atendimento, como WhatsApp (Meta), Instagram (Meta), Google Analytics e Google Maps, cada um com sua própria política de privacidade.</p>
<h2>6. Por quanto tempo guardamos</h2>
<p>Pelo tempo necessário para o atendimento e para cumprir obrigações legais. Os dados do Google Analytics são mantidos por até 14 meses.</p>
<h2>7. Seus direitos</h2>
<p>Você pode pedir a confirmação, o acesso, a correção, a portabilidade ou a exclusão dos seus dados, além de revogar consentimentos, falando com a clínica pelo Instagram <a href="{IG}">@clinicabrunabarbosa</a> ou presencialmente no endereço acima. Você também pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD).</p>
<h2>8. Mudanças nesta política</h2>
<p>Esta política pode ser atualizada. A data no topo da página indica a última revisão.</p>'''

TERMOS = f'''
<p>Ao usar este site, você concorda com os termos abaixo. Se não concordar, recomendamos não utilizá-lo.</p>
<h2>1. Sobre o site</h2>
<p>Este é o site institucional da {NOME} (B. Barbosa Santos Almeida Instituto de Estética, CNPJ 15.228.378/0001-14), localizada na {ENDERECO}. O objetivo é apresentar a clínica, os tratamentos e facilitar o agendamento.</p>
<h2>2. Informações de saúde e estética</h2>
<p>O conteúdo do site é informativo e não substitui uma avaliação presencial. A indicação de qualquer tratamento depende da avaliação individual, e os resultados variam de pessoa para pessoa conforme o organismo, o protocolo e os hábitos de cada cliente. Nenhum resultado é garantido.</p>
<h2>3. Agendamento</h2>
<p>O formulário e os botões de contato apenas iniciam uma conversa com a clínica. O agendamento só é confirmado pela equipe, com data e horário definidos.</p>
<h2>4. Imagens e conteúdo</h2>
<p>Textos, marca, fotos e vídeos deste site pertencem à {NOME} ou são usados com autorização. Não é permitido copiar, reproduzir ou usar esse conteúdo sem autorização prévia por escrito. As imagens de clientes foram publicadas com consentimento e não podem ser reutilizadas.</p>
<h2>5. Links externos</h2>
<p>O site traz links para Instagram, WhatsApp e Google Maps. Esses serviços têm termos e políticas próprios, pelos quais a clínica não responde.</p>
<h2>6. Privacidade</h2>
<p>O tratamento de dados pessoais segue a nossa <a href="privacidade.html">Política de privacidade</a>.</p>
<h2>7. Alterações e foro</h2>
<p>Estes termos podem ser atualizados a qualquer momento. Fica eleito o foro da comarca de Itabuna (BA) para resolver eventuais questões, conforme a legislação brasileira e o Código de Defesa do Consumidor.</p>'''


def centro(arquivo, titulo, descricao, miolo, indexar=False):
    corpo = f'''
<main id="conteudo" tabindex="-1" class="centro">
  <div>{miolo}</div>
</main>'''
    return head(titulo, descricao, arquivo, indexar=indexar) + topo("index.html") + corpo + rodape("index.html")


OBRIGADO = f'''
    <div class="selo-ok">{IC["ok"]}</div>
    <p class="eyebrow" style="justify-content:center">Pedido enviado</p>
    <h1>Obrigada<span data-nome-obrigado></span>! <em>Seu pedido saiu.</em></h1>
    <p class="lead">Abrimos a conversa com a clínica numa nova aba. Se a mensagem não apareceu pronta, cole o texto (ele foi copiado) ou só diga “quero agendar uma avaliação”. A equipe responde em breve.</p>
    <div class="centro__acoes">
      <a class="btn btn--ouro btn--grande" href="https://www.instagram.com/clinicabrunabarbosa/" data-contato data-origem="obrigado">{IC["wa"]}Abrir a conversa de novo</a>
      <a class="btn btn--contorno btn--grande" href="index.html#resultados">Ver mais resultados</a>
    </div>'''

NAO_ACHADA = f'''
    <div class="numero-404" aria-hidden="true"><span>4</span><span>0</span><span>4</span></div>
    <h1>Essa página <em>saiu para uma sessão</em>.</h1>
    <p class="lead">O endereço que você abriu não existe ou mudou de lugar. Volte ao início ou já aproveite para agendar a sua avaliação.</p>
    <div class="centro__acoes">
      <a class="btn btn--ouro btn--grande" href="index.html">Voltar ao início</a>
      <a class="btn btn--contorno btn--grande" href="https://www.instagram.com/clinicabrunabarbosa/" data-contato data-origem="pagina_404">{IC["cal"]}Agendar avaliação</a>
    </div>'''


def main():
    arquivos = {
        "index.html": index(),
        "privacidade.html": pagina_texto("privacidade.html", "Política de privacidade | Clínica Bruna Barbosa", "Como a Clínica Bruna Barbosa, em Itabuna (BA), coleta, usa e protege seus dados pessoais e cookies, conforme a LGPD.", "Política de privacidade", PRIVACIDADE),
        "termos.html": pagina_texto("termos.html", "Termos de uso | Clínica Bruna Barbosa", "Condições de uso do site da Clínica Bruna Barbosa, clínica de estética corporal e facial em Itabuna (BA).", "Termos de uso", TERMOS),
        "obrigado.html": centro("obrigado.html", "Pedido enviado | Clínica Bruna Barbosa", "Recebemos o seu pedido de agendamento na Clínica Bruna Barbosa, em Itabuna (BA). A equipe vai responder em breve.", OBRIGADO),
        "404.html": centro("404.html", "Página não encontrada | Clínica Bruna Barbosa", "A página procurada não existe no site da Clínica Bruna Barbosa. Volte ao início ou agende sua avaliação em Itabuna (BA).", NAO_ACHADA),
    }
    for nome, html in arquivos.items():
        if nome == "404.html":  # o GitHub Pages serve a 404 em qualquer caminho; links absolutos evitam quebrar
            html = html.replace("<head>\n", '<head>\n<base href="/bruna-mattos-advogada/clinica-bruna-barbosa/">\n', 1)
        (PASTA / nome).write_text(html, encoding="utf-8")
        print("gerado", nome)


if __name__ == "__main__":
    main()
