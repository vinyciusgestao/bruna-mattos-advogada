# Site da Clínica Bruna Barbosa

Site estático (HTML, CSS e JavaScript, sem build) da Clínica Bruna Barbosa, de estética corporal e facial em Itabuna (BA).

- **Endereço (registro público do CNPJ 15.228.378/0001-14):** Rua Pernambuco, 345, Jardim Vitória, Itabuna (BA), CEP 45605-510
- **Instagram:** [@clinicabrunabarbosa](https://www.instagram.com/clinicabrunabarbosa/)
- **Publicado em:** https://vinyciusgestao.github.io/bruna-mattos-advogada/clinica-bruna-barbosa/

## O que falta preencher (tudo em `assets/js/config.js`)

| O quê | Onde | Enquanto estiver vazio |
|---|---|---|
| WhatsApp | `CONFIG.whatsapp` (ex.: `5573999998888`) | Os botões abrem o Direct do Instagram |
| Telefone exibido | `CONFIG.telefoneExibicao` | A linha de telefone some do site |
| Google Analytics 4 | `CONFIG.gaId` (`G-XXXXXXXXXX`) | Nenhum analytics é carregado |
| Vídeos de relatos | lista `RELATOS` | Cartões abrem os Reels do Instagram |
| Fotos de antes e depois | lista `RESULTADOS` | Cartões aparecem como espaço reservado |

### Vídeos de relatos
Duas opções para cada vídeo:

1. **Arquivo no site:** baixe o Reel, coloque o MP4 (vertical 9:16, até ~15 MB) e uma capa JPG em `assets/videos/` e cadastre `{ tipo: 'arquivo', src, capa, nome, procedimento, alt }`.
2. **Reel do Instagram:** cadastre `{ tipo: 'instagram', url: 'https://www.instagram.com/reel/CODIGO/', ... }`. O vídeo abre pelo player oficial do Instagram.

### Fotos de antes e depois
Coloque as fotos em `assets/img/resultados/` (retrato 4:5) e preencha `antes`, `depois`, `altAntes` e `altDepois`.

> Publique relatos e fotos de clientes **somente com autorização por escrito** (uso de imagem e LGPD), e confira as regras de publicidade do conselho profissional de quem faz os atendimentos.

## Cores
A paleta (creme, nude, rosé, dourado e cacau) fica nos tokens de `:root`, no topo de `assets/css/estilo.css`. Para alinhar ao tom exato do Instagram, troque só esses valores.

## Editar textos e páginas
As páginas `index.html`, `privacidade.html`, `termos.html`, `obrigado.html` e `404.html` são geradas por `_ferramentas/gerar_paginas.py`. Edite os textos no script e rode, na raiz do repositório:

```bash
python3 clinica-bruna-barbosa/_ferramentas/gerar_paginas.py
```

## O que o site tem
CTA no topo da página e CTA fixo no celular · cena 3D em WebGL (Three.js) no topo · cartões 3D que viram · comparador de antes e depois · carrossel 3D de vídeos · cubo 3D · inclinação com o mouse · tela de carregamento animada · formulário com erros por campo e página de obrigado · banner de cookies com o Analytics carregado só depois do aceite · 404 personalizada · política de privacidade e termos de uso · meta title, description e Open Graph em todas as páginas · favicons · `robots.txt` e `sitemap.xml` · dados estruturados (schema.org) · texto alternativo em todas as imagens · respeita "reduzir movimento" do sistema.
