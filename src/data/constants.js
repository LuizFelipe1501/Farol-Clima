export const PILARES = {
  governanca: {
    label: 'Governança',
    cor: '#3B82F6',
    componentes: {
      G1: { label: 'Estrutura institucional', itens: ['A','B','C'] },
      G2: { label: 'Legislação climática', itens: ['A','B','C'] },
      G3: { label: 'Avaliação de riscos', itens: ['A','B'] },
      G4: { label: 'Cooperação intergovernamental', itens: ['A','B','C'] },
      G5: { label: 'Participação social', itens: ['A','B'] },
      G6: { label: 'Grupos vulneráveis', itens: ['A','B','C'] },
      G7: { label: 'Transparência e dados', itens: ['A','B','C'] },
    },
  },
  politicas: {
    label: 'Políticas Públicas',
    cor: '#8B5CF6',
    componentes: {
      P1: { label: 'Plano de mitigação', itens: ['A','B','C'] },
      P2: { label: 'Plano de adaptação', itens: ['A','B','C'] },
      P3: { label: 'Inventário de emissões', itens: ['A','B','C','D'] },
      P4: { label: 'Monitoramento e reporte', itens: ['A','B','C','D'] },
      P5: { label: 'Resiliência pós-desastre', itens: ['A','B','C'] },
    },
  },
  financas: {
    label: 'Financiamento',
    cor: '#F59E0B',
    componentes: {
      F1: { label: 'Orçamento climático', itens: ['A','B','C','D'] },
      F2: { label: 'Acesso a programas', itens: ['A','B','C'] },
      F3: { label: 'Investimento privado', itens: ['A','B'] },
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
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso', PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco',
  PI: 'Piauí', PR: 'Paraná', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins',
}

export const UF_REGIAO = Object.entries(REGIOES).reduce((acc, [regiao, { estados }]) => {
  estados.forEach(uf => { acc[uf] = regiao })
  return acc
}, {})
