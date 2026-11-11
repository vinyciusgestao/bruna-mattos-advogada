// =====================================================================================
// CONFIGURAÇÃO DO SITE DA CLÍNICA BRUNA BARBOSA
// Tudo o que muda com frequência fica aqui: contato, analytics, vídeos e fotos.
// =====================================================================================

export const CONFIG = {
  // WhatsApp com DDI + DDD + número, só dígitos. Ex.: '5573999998888'.
  // Enquanto estiver vazio, os botões de agendamento abrem o Direct do Instagram.
  whatsapp: '',
  // Telefone como deve aparecer escrito no site. Vazio = a linha de telefone não aparece.
  telefoneExibicao: '',
  instagram: 'clinicabrunabarbosa',
  // Google Analytics 4: ID de medição no formato G-XXXXXXXXXX.
  // Só carrega depois que a visitante aceita os cookies.
  gaId: '',
  mensagemPadrao: 'Olá! Vim pelo site da Clínica Bruna Barbosa e gostaria de agendar uma avaliação.',
};

// -------------------------------------------------------------------------------------
// RELATOS EM VÍDEO (carrossel 3D)
// Três formas de cadastrar cada vídeo:
//   1) Arquivo no site:   { tipo: 'arquivo', src: 'assets/videos/relato-1.mp4', capa: 'assets/videos/relato-1.jpg', ... }
//   2) Reel do Instagram: { tipo: 'instagram', url: 'https://www.instagram.com/reel/CODIGO/', ... }
//   3) Espaço reservado:  { tipo: 'vazio', ... } abre o perfil no Instagram até o vídeo ser trocado.
// 'alt' descreve o vídeo para leitores de tela (obrigatório).
// Publique apenas relatos com autorização por escrito da cliente (LGPD, uso de imagem).
// -------------------------------------------------------------------------------------
export const RELATOS = [
  { tipo: 'vazio', nome: 'Relato de cliente', procedimento: 'Protocolo de redução de medidas', alt: 'Espaço para o vídeo de relato de uma cliente sobre o protocolo de redução de medidas' },
  { tipo: 'vazio', nome: 'Relato de cliente', procedimento: 'Drenagem linfática', alt: 'Espaço para o vídeo de relato de uma cliente sobre drenagem linfática' },
  { tipo: 'vazio', nome: 'Relato de cliente', procedimento: 'Massagem modeladora', alt: 'Espaço para o vídeo de relato de uma cliente sobre massagem modeladora' },
  { tipo: 'vazio', nome: 'Relato de cliente', procedimento: 'Tratamento de celulite', alt: 'Espaço para o vídeo de relato de uma cliente sobre tratamento de celulite' },
  { tipo: 'vazio', nome: 'Relato de cliente', procedimento: 'Limpeza de pele', alt: 'Espaço para o vídeo de relato de uma cliente sobre limpeza de pele' },
  { tipo: 'vazio', nome: 'Relato de cliente', procedimento: 'Pós-operatório', alt: 'Espaço para o vídeo de relato de uma cliente sobre drenagem pós-operatória' },
];

// -------------------------------------------------------------------------------------
// RESULTADOS: ANTES E DEPOIS (comparador que se arrasta)
// Coloque as fotos em assets/img/resultados/ e preencha:
//   { antes: 'assets/img/resultados/abdomen-antes.jpg', depois: 'assets/img/resultados/abdomen-depois.jpg',
//     titulo: 'Abdômen', detalhe: '10 sessões de protocolo de redução', altAntes: '...', altDepois: '...' }
// Sem 'antes' e 'depois', o cartão aparece como espaço reservado.
// -------------------------------------------------------------------------------------
export const RESULTADOS = [
  { titulo: 'Abdômen', detalhe: 'Protocolo de redução de medidas', altAntes: 'Abdômen de cliente antes do protocolo de redução de medidas', altDepois: 'Abdômen da mesma cliente depois do protocolo de redução de medidas' },
  { titulo: 'Culote e glúteos', detalhe: 'Tratamento de celulite e flacidez', altAntes: 'Região do culote de cliente antes do tratamento de celulite', altDepois: 'Região do culote da mesma cliente depois do tratamento de celulite' },
  { titulo: 'Rosto', detalhe: 'Limpeza de pele profunda', altAntes: 'Pele do rosto de cliente antes da limpeza de pele', altDepois: 'Pele do rosto da mesma cliente depois da limpeza de pele' },
];
