export const PILARES = {
  governanca: {
    label: 'Governança',
    cor: '#3B82F6',
    desc: 'Avalia se o estado tem estrutura, leis e processos para lidar com as mudanças climáticas.',
    componentes: {
      G1: { label: 'Estrutura institucional', itens: ['A','B','C'], desc: 'O estado tem um órgão, secretaria ou comitê dedicado a coordenar ações climáticas?' },
      G2: { label: 'Legislação climática', itens: ['A','B','C'], desc: 'Existem leis estaduais sobre mudanças climáticas, como política estadual de clima ou fundo climático?' },
      G3: { label: 'Avaliação de riscos', itens: ['A','B'], desc: 'O estado mapeou quais regiões e populações estão mais vulneráveis a secas, enchentes e calor extremo?' },
      G4: { label: 'Cooperação intergovernamental', itens: ['A','B','C'], desc: 'O estado participa de redes, consórcios ou acordos com outros estados, municípios ou organismos internacionais sobre clima?' },
      G5: { label: 'Participação social', itens: ['A','B'], desc: 'Existem mecanismos para que cidadãos, cientistas e empresários participem das decisões climáticas do estado?' },
      G6: { label: 'Grupos vulneráveis', itens: ['A','B','C'], desc: 'O estado identificou e dá atenção especial a comunidades indígenas, ribeirinhas, periféricas e outros grupos mais afetados pelo clima?' },
      G7: { label: 'Transparência e dados', itens: ['A','B','C'], desc: 'Os dados sobre ações climáticas são públicos e acessíveis? O estado publica relatórios e indicadores?' },
    },
  },
  politicas: {
    label: 'Políticas Públicas',
    cor: '#8B5CF6',
    desc: 'Avalia se o estado tem planos concretos para reduzir poluição e se preparar para eventos extremos.',
    componentes: {
      P1: { label: 'Plano de mitigação', itens: ['A','B','C'], desc: 'O estado tem um plano com metas concretas para reduzir as emissões de gases que aquecem o planeta?' },
      P2: { label: 'Plano de adaptação', itens: ['A','B','C'], desc: 'Existe um plano para preparar o estado para lidar com secas, enchentes, ondas de calor e outros eventos extremos?' },
      P3: { label: 'Inventário de emissões', itens: ['A','B','C','D'], desc: 'O estado sabe quanto de gases poluentes emite? Tem um inventário atualizado por setor (transporte, energia, agropecuária)?' },
      P4: { label: 'Monitoramento e reporte', itens: ['A','B','C','D'], desc: 'As metas climáticas são acompanhadas? Existem relatórios periódicos mostrando o progresso?' },
      P5: { label: 'Resiliência pós-desastre', itens: ['A','B','C'], desc: 'O estado tem capacidade de se recuperar após enchentes, secas ou outros desastres? Existem planos de contingência e reconstrução?' },
    },
  },
  financas: {
    label: 'Financiamento',
    cor: '#F59E0B',
    desc: 'Avalia se o estado dedica dinheiro público e atrai investimento privado para ações climáticas.',
    componentes: {
      F1: { label: 'Orçamento climático', itens: ['A','B','C','D'], desc: 'O estado sabe quanto gasta com ações climáticas? Existe orçamento separado e rastreável para isso?' },
      F2: { label: 'Acesso a programas', itens: ['A','B','C'], desc: 'O estado acessa fundos federais e internacionais para clima? Exemplos: Fundo Clima, GCF, recursos do BNDES Verde.' },
      F3: { label: 'Investimento privado', itens: ['A','B'], desc: 'O estado consegue atrair investimento do setor privado para ações climáticas? Existem incentivos fiscais ou parcerias?' },
    },
  },
}

export function getEscala(valor) {
  if (valor >= 0.9) return { label: 'Avançado', cor: '#22C55E' }
  if (valor >= 0.5) return { label: 'Intermediário', cor: '#EAB308' }
  if (valor >= 0.2) return { label: 'Inicial', cor: '#F97316' }
  return { label: 'Sem progresso', cor: '#EF4444' }
}

export const REGIOES = {
  N:  { label: 'Norte', estados: ['AC','AM','AP','PA','RO','RR','TO'] },
  NE: { label: 'Nordeste', estados: ['AL','BA','CE','MA','PB','PE','PI','RN','SE'] },
  CO: { label: 'Centro-Oeste', estados: ['DF','GO','MS','MT'] },
  SE: { label: 'Sudeste', estados: ['ES','MG','RJ','SP'] },
  S:  { label: 'Sul', estados: ['PR','RS','SC'] },
}

export const UF_NOMES = {
  AC:'Acre',AL:'Alagoas',AM:'Amazonas',AP:'Amapá',BA:'Bahia',CE:'Ceará',
  DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',
  MG:'Minas Gerais',MS:'Mato Grosso do Sul',MT:'Mato Grosso',PA:'Pará',
  PB:'Paraíba',PE:'Pernambuco',PI:'Piauí',PR:'Paraná',RJ:'Rio de Janeiro',
  RN:'Rio Grande do Norte',RO:'Rondônia',RR:'Roraima',RS:'Rio Grande do Sul',
  SC:'Santa Catarina',SE:'Sergipe',SP:'São Paulo',TO:'Tocantins',
}

export const UF_REGIAO = Object.entries(REGIOES).reduce((acc, [regiao, { estados }]) => {
  estados.forEach(uf => { acc[uf] = regiao })
  return acc
}, {})
