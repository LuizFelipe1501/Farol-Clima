// Escala de cores mais legível para o mapa
// Vermelho escuro → laranja → amarelo → verde claro → verde → azul-petróleo
function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]
}
function rgbToHex(r,g,b) {
  return '#' + [r,g,b].map(x => Math.round(x).toString(16).padStart(2,'0')).join('')
}

export function scoreToColor(score) {
  const stops = [
    { at: 0,   color: '#991B1B' },  // vermelho escuro
    { at: 20,  color: '#DC2626' },  // vermelho
    { at: 35,  color: '#EA580C' },  // laranja
    { at: 50,  color: '#D97706' },  // amarelo escuro
    { at: 65,  color: '#65A30D' },  // verde-limão
    { at: 80,  color: '#059669' },  // emerald
    { at: 100, color: '#0D9488' },  // teal
  ]

  if (score <= 0) return stops[0].color
  if (score >= 100) return stops[stops.length - 1].color

  let lower = stops[0], upper = stops[1]
  for (let i = 1; i < stops.length; i++) {
    if (score <= stops[i].at) {
      lower = stops[i - 1]
      upper = stops[i]
      break
    }
  }

  const t = (score - lower.at) / (upper.at - lower.at)
  const [r1,g1,b1] = hexToRgb(lower.color)
  const [r2,g2,b2] = hexToRgb(upper.color)
  return rgbToHex(r1+(r2-r1)*t, g1+(g2-g1)*t, b1+(b2-b1)*t)
}
