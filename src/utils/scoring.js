// Scores já vêm calculados do JSON (processados no Python)
// Estas funções são para display

export function getCorScore(score) {
  if (score >= 75) return '#22C55E'
  if (score >= 50) return '#86EFAC'
  if (score >= 35) return '#EAB308'
  if (score >= 15) return '#F97316'
  return '#EF4444'
}

export function getLabelScore(score) {
  if (score >= 75) return 'Avançado'
  if (score >= 50) return 'Em progresso'
  if (score >= 35) return 'Quase'
  if (score >= 15) return 'Iniciando'
  return 'Não iniciado'
}
