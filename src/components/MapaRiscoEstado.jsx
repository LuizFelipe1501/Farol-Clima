import { useState, useEffect } from 'react'
import { AlertTriangle, Loader2, RefreshCw, ExternalLink, Info } from 'lucide-react'

/*
  Mapa de zonas de risco DENTRO da capital de cada estado.
  Mostra bairros/regiões com classificação de risco climático.
  Dados: CEMADEN setores de risco + base local de bairros vulneráveis conhecidos.
*/

const RISK_COLORS = {
  muito_alto: { fill: '#DC2626', stroke: '#991B1B', label: 'Muito Alto', bg: '#FEF2F2' },
  alto:       { fill: '#F97316', stroke: '#C2410C', label: 'Alto', bg: '#FFF7ED' },
  medio:      { fill: '#EAB308', stroke: '#A16207', label: 'Médio', bg: '#FEFCE8' },
  baixo:      { fill: '#22C55E', stroke: '#15803D', label: 'Baixo', bg: '#F0FDF4' },
}

const UF_CAPITAL = {
  AC:'Rio Branco',AL:'Maceió',AM:'Manaus',AP:'Macapá',BA:'Salvador',CE:'Fortaleza',
  DF:'Brasília',ES:'Vitória',GO:'Goiânia',MA:'São Luís',MG:'Belo Horizonte',MS:'Campo Grande',
  MT:'Cuiabá',PA:'Belém',PB:'João Pessoa',PE:'Recife',PI:'Teresina',PR:'Curitiba',
  RJ:'Rio de Janeiro',RN:'Natal',RO:'Porto Velho',RR:'Boa Vista',RS:'Porto Alegre',
  SC:'Florianópolis',SE:'Aracaju',SP:'São Paulo',TO:'Palmas',
}

/* Coordenadas centrais e zoom das capitais */
const UF_CENTER = {
  AC:{lat:-9.975,lon:-67.81,z:0.15}, AL:{lat:-9.666,lon:-35.735,z:0.08},
  AM:{lat:-3.119,lon:-60.022,z:0.15}, AP:{lat:0.034,lon:-51.066,z:0.10},
  BA:{lat:-12.972,lon:-38.512,z:0.10}, CE:{lat:-3.717,lon:-38.543,z:0.10},
  DF:{lat:-15.793,lon:-47.882,z:0.12}, ES:{lat:-20.319,lon:-40.338,z:0.08},
  GO:{lat:-16.686,lon:-49.264,z:0.10}, MA:{lat:-2.530,lon:-44.282,z:0.10},
  MG:{lat:-19.920,lon:-43.938,z:0.12}, MS:{lat:-20.469,lon:-54.620,z:0.12},
  MT:{lat:-15.601,lon:-56.097,z:0.12}, PA:{lat:-1.456,lon:-48.502,z:0.10},
  PB:{lat:-7.115,lon:-34.863,z:0.08}, PE:{lat:-8.054,lon:-34.871,z:0.10},
  PI:{lat:-5.092,lon:-42.803,z:0.10}, PR:{lat:-25.428,lon:-49.273,z:0.12},
  RJ:{lat:-22.907,lon:-43.173,z:0.15}, RN:{lat:-5.795,lon:-35.209,z:0.08},
  RO:{lat:-8.762,lon:-63.904,z:0.12}, RR:{lat:2.819,lon:-60.673,z:0.10},
  RS:{lat:-30.033,lon:-51.230,z:0.12}, SC:{lat:-27.595,lon:-48.548,z:0.08},
  SE:{lat:-10.909,lon:-37.072,z:0.06}, SP:{lat:-23.551,lon:-46.634,z:0.18},
  TO:{lat:-10.184,lon:-48.334,z:0.12},
}

/* Bairros/zonas de risco por capital (dados reais de CEMADEN/Defesa Civil) */
const CAPITAL_RISK_ZONES = {
  SP: [
    { nome:'Brasilândia',lat:-23.468,lon:-46.680,risco:'muito_alto',tipo:'Deslizamento/Alagamento' },
    { nome:'M\'Boi Mirim',lat:-23.680,lon:-46.740,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Ipiranga (várzea)',lat:-23.595,lon:-46.603,risco:'alto',tipo:'Enchente' },
    { nome:'Jardim Ângela',lat:-23.715,lon:-46.755,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Parelheiros',lat:-23.820,lon:-46.730,risco:'alto',tipo:'Deslizamento' },
    { nome:'Capão Redondo',lat:-23.680,lon:-46.780,risco:'alto',tipo:'Alagamento' },
    { nome:'Cidade Ademar',lat:-23.665,lon:-46.658,risco:'alto',tipo:'Alagamento' },
    { nome:'Tremembé',lat:-23.440,lon:-46.633,risco:'medio',tipo:'Deslizamento' },
    { nome:'Pinheiros (Marginal)',lat:-23.565,lon:-46.692,risco:'medio',tipo:'Enchente' },
    { nome:'Lapa',lat:-23.520,lon:-46.700,risco:'medio',tipo:'Enchente' },
    { nome:'Vila Prudente',lat:-23.585,lon:-46.580,risco:'baixo',tipo:'Alagamento pontual' },
    { nome:'Mooca',lat:-23.558,lon:-46.598,risco:'baixo',tipo:'Enchente controlada' },
  ],
  RJ: [
    { nome:'Rocinha',lat:-22.987,lon:-43.247,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Vidigal',lat:-22.993,lon:-43.232,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Santa Teresa',lat:-22.922,lon:-43.186,risco:'alto',tipo:'Deslizamento' },
    { nome:'Praça da Bandeira',lat:-22.911,lon:-43.201,risco:'alto',tipo:'Enchente' },
    { nome:'Rio Comprido',lat:-22.918,lon:-43.196,risco:'alto',tipo:'Enchente' },
    { nome:'Jacarepaguá',lat:-22.948,lon:-43.370,risco:'medio',tipo:'Alagamento' },
    { nome:'Campo Grande',lat:-22.901,lon:-43.560,risco:'medio',tipo:'Enchente' },
    { nome:'Barra da Tijuca',lat:-23.003,lon:-43.365,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  MG: [
    { nome:'Barreiro',lat:-20.016,lon:-44.019,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Venda Nova',lat:-19.847,lon:-43.962,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Ribeirão Arrudas (calha)',lat:-19.924,lon:-43.958,risco:'alto',tipo:'Enchente' },
    { nome:'Pampulha (entorno lagoa)',lat:-19.854,lon:-43.973,risco:'medio',tipo:'Alagamento' },
    { nome:'Regional Leste',lat:-19.919,lon:-43.900,risco:'alto',tipo:'Deslizamento' },
    { nome:'Savassi',lat:-19.935,lon:-43.936,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  RS: [
    { nome:'Centro Histórico',lat:-30.030,lon:-51.230,risco:'muito_alto',tipo:'Enchente (2024)' },
    { nome:'Sarandi',lat:-29.975,lon:-51.130,risco:'muito_alto',tipo:'Enchente' },
    { nome:'Humaitá',lat:-30.015,lon:-51.243,risco:'muito_alto',tipo:'Enchente Guaíba' },
    { nome:'Navegantes',lat:-29.998,lon:-51.186,risco:'alto',tipo:'Enchente' },
    { nome:'Cristal',lat:-30.078,lon:-51.233,risco:'alto',tipo:'Enchente Guaíba' },
    { nome:'Restinga',lat:-30.130,lon:-51.190,risco:'medio',tipo:'Alagamento' },
    { nome:'Moinhos de Vento',lat:-30.027,lon:-51.202,risco:'baixo',tipo:'Drenagem' },
  ],
  BA: [
    { nome:'Bairro da Paz',lat:-12.925,lon:-38.388,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Saramandaia',lat:-12.968,lon:-38.458,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Calabar',lat:-13.002,lon:-38.508,risco:'alto',tipo:'Deslizamento' },
    { nome:'Subúrbio (Periperi)',lat:-12.903,lon:-38.516,risco:'alto',tipo:'Deslizamento e Enchente' },
    { nome:'Boca do Rio',lat:-12.979,lon:-38.426,risco:'medio',tipo:'Alagamento costeiro' },
    { nome:'Pituba',lat:-12.982,lon:-38.450,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  PE: [
    { nome:'Jardim Monte Verde',lat:-8.080,lon:-35.010,risco:'muito_alto',tipo:'Deslizamento (2022)' },
    { nome:'Ibura',lat:-8.103,lon:-34.944,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Areias',lat:-8.077,lon:-34.918,risco:'alto',tipo:'Enchente' },
    { nome:'Dois Unidos',lat:-7.994,lon:-34.892,risco:'alto',tipo:'Deslizamento' },
    { nome:'Boa Viagem',lat:-8.110,lon:-34.893,risco:'medio',tipo:'Erosão costeira' },
    { nome:'Boa Vista',lat:-8.044,lon:-34.886,risco:'baixo',tipo:'Alagamento' },
  ],
  CE: [
    { nome:'Barra do Ceará',lat:-3.690,lon:-38.583,risco:'alto',tipo:'Erosão costeira' },
    { nome:'Pirambu',lat:-3.714,lon:-38.552,risco:'alto',tipo:'Enchente/Erosão' },
    { nome:'Conjunto Ceará',lat:-3.780,lon:-38.612,risco:'medio',tipo:'Alagamento' },
    { nome:'Aldeota',lat:-3.733,lon:-38.510,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  PA: [
    { nome:'Guamá',lat:-1.440,lon:-48.480,risco:'muito_alto',tipo:'Alagamento/Maré' },
    { nome:'Terra Firme',lat:-1.438,lon:-48.475,risco:'muito_alto',tipo:'Alagamento' },
    { nome:'Jurunas',lat:-1.467,lon:-48.503,risco:'alto',tipo:'Alagamento' },
    { nome:'Ver-o-Peso',lat:-1.452,lon:-48.505,risco:'medio',tipo:'Maré alta' },
    { nome:'Nazaré',lat:-1.440,lon:-48.495,risco:'baixo',tipo:'Drenagem' },
  ],
  SC: [
    { nome:'Maciço do Morro da Cruz',lat:-27.585,lon:-48.555,risco:'muito_alto',tipo:'Deslizamento' },
    { nome:'Costeira',lat:-27.620,lon:-48.535,risco:'alto',tipo:'Deslizamento' },
    { nome:'Ingleses',lat:-27.435,lon:-48.395,risco:'medio',tipo:'Erosão costeira' },
    { nome:'Centro',lat:-27.596,lon:-48.549,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  PR: [
    { nome:'Cajuru',lat:-25.460,lon:-49.225,risco:'alto',tipo:'Enchente' },
    { nome:'Uberaba',lat:-25.470,lon:-49.230,risco:'alto',tipo:'Enchente do Iguaçu' },
    { nome:'CIC',lat:-25.475,lon:-49.345,risco:'medio',tipo:'Alagamento' },
    { nome:'Batel',lat:-25.440,lon:-49.280,risco:'baixo',tipo:'Drenagem' },
  ],
  AM: [
    { nome:'Educandos',lat:-3.135,lon:-60.010,risco:'muito_alto',tipo:'Enchente/Cheia' },
    { nome:'São Raimundo',lat:-3.115,lon:-60.040,risco:'muito_alto',tipo:'Enchente' },
    { nome:'Compensa',lat:-3.113,lon:-60.055,risco:'alto',tipo:'Alagamento' },
    { nome:'Centro',lat:-3.130,lon:-60.022,risco:'medio',tipo:'Cheia sazonal' },
  ],
  DF: [
    { nome:'Estrutural',lat:-15.783,lon:-47.995,risco:'alto',tipo:'Erosão/Alagamento' },
    { nome:'Sol Nascente',lat:-15.805,lon:-48.080,risco:'alto',tipo:'Ocupação irregular' },
    { nome:'Vicente Pires',lat:-15.800,lon:-48.065,risco:'medio',tipo:'Enchente urbana' },
    { nome:'Asa Sul (W3)',lat:-15.830,lon:-47.920,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  GO: [
    { nome:'Jardim Novo Mundo',lat:-16.658,lon:-49.225,risco:'alto',tipo:'Enchente' },
    { nome:'Vila Mutirão',lat:-16.645,lon:-49.310,risco:'alto',tipo:'Alagamento' },
    { nome:'Setor Bueno',lat:-16.710,lon:-49.260,risco:'baixo',tipo:'Drenagem' },
  ],
  PI: [
    { nome:'Poti Velho',lat:-5.050,lon:-42.775,risco:'muito_alto',tipo:'Enchente do Poti' },
    { nome:'Santa Maria',lat:-5.105,lon:-42.830,risco:'alto',tipo:'Enchente' },
    { nome:'Centro/Norte',lat:-5.085,lon:-42.800,risco:'medio',tipo:'Calor extremo' },
  ],
  AL: [
    { nome:'Mutange/Pinheiro',lat:-9.640,lon:-35.755,risco:'muito_alto',tipo:'Subsidência (Braskem)' },
    { nome:'Bebedouro',lat:-9.650,lon:-35.748,risco:'muito_alto',tipo:'Subsidência' },
    { nome:'Vergel do Lago',lat:-9.680,lon:-35.720,risco:'alto',tipo:'Alagamento' },
    { nome:'Pajuçara',lat:-9.665,lon:-35.710,risco:'baixo',tipo:'Erosão costeira leve' },
  ],
  MA: [
    { nome:'Coroadinho',lat:-2.523,lon:-44.265,risco:'alto',tipo:'Alagamento' },
    { nome:'Anjo da Guarda',lat:-2.530,lon:-44.310,risco:'alto',tipo:'Maré/Enchente' },
    { nome:'São Francisco',lat:-2.502,lon:-44.290,risco:'medio',tipo:'Erosão costeira' },
  ],
  RN: [
    { nome:'Mãe Luíza',lat:-5.776,lon:-35.187,risco:'alto',tipo:'Deslizamento dunas' },
    { nome:'Ribeira',lat:-5.782,lon:-35.218,risco:'medio',tipo:'Enchente' },
    { nome:'Ponta Negra',lat:-5.875,lon:-35.175,risco:'medio',tipo:'Erosão costeira' },
  ],
  PB: [
    { nome:'São José',lat:-7.103,lon:-34.868,risco:'alto',tipo:'Alagamento' },
    { nome:'Mangabeira',lat:-7.170,lon:-34.835,risco:'medio',tipo:'Alagamento' },
    { nome:'Tambaú',lat:-7.108,lon:-34.832,risco:'baixo',tipo:'Erosão costeira leve' },
  ],
  SE: [
    { nome:'Santa Maria',lat:-10.930,lon:-37.060,risco:'alto',tipo:'Alagamento' },
    { nome:'Bugio',lat:-10.888,lon:-37.078,risco:'medio',tipo:'Enchente' },
    { nome:'Atalaia',lat:-10.970,lon:-37.040,risco:'baixo',tipo:'Erosão costeira' },
  ],
  ES: [
    { nome:'São Pedro',lat:-20.325,lon:-40.310,risco:'alto',tipo:'Deslizamento' },
    { nome:'Jucutuquara',lat:-20.312,lon:-40.332,risco:'medio',tipo:'Alagamento' },
    { nome:'Praia do Canto',lat:-20.298,lon:-40.292,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  MS: [
    { nome:'Anhanduí (calha)',lat:-20.505,lon:-54.610,risco:'alto',tipo:'Enchente' },
    { nome:'Lagoa da Cruz',lat:-20.480,lon:-54.635,risco:'medio',tipo:'Alagamento' },
  ],
  MT: [
    { nome:'Ribeirão do Lipa',lat:-15.640,lon:-56.130,risco:'alto',tipo:'Enchente' },
    { nome:'Pedra 90',lat:-15.650,lon:-56.065,risco:'medio',tipo:'Calor extremo' },
  ],
  RO: [
    { nome:'Triângulo',lat:-8.770,lon:-63.880,risco:'muito_alto',tipo:'Cheia do Madeira' },
    { nome:'Nacional',lat:-8.760,lon:-63.910,risco:'alto',tipo:'Enchente' },
    { nome:'Centro',lat:-8.762,lon:-63.900,risco:'medio',tipo:'Alagamento' },
  ],
  RR: [
    { nome:'Caetano',lat:2.830,lon:-60.680,risco:'medio',tipo:'Queimada urbana' },
    { nome:'Centro',lat:2.820,lon:-60.673,risco:'baixo',tipo:'Alagamento pontual' },
  ],
  AP: [
    { nome:'Perpétuo Socorro',lat:0.035,lon:-51.060,risco:'alto',tipo:'Alagamento' },
    { nome:'Buritizal',lat:0.012,lon:-51.070,risco:'medio',tipo:'Maré alta' },
  ],
  AC: [
    { nome:'Cidade do Povo',lat:-10.025,lon:-67.880,risco:'alto',tipo:'Enchente do Acre' },
    { nome:'6º Distrito',lat:-9.965,lon:-67.815,risco:'alto',tipo:'Enchente' },
    { nome:'Centro',lat:-9.975,lon:-67.810,risco:'medio',tipo:'Alagamento' },
  ],
  TO: [
    { nome:'Taquaralto',lat:-10.250,lon:-48.330,risco:'medio',tipo:'Queimada' },
    { nome:'Plano Diretor Sul',lat:-10.200,lon:-48.350,risco:'baixo',tipo:'Calor extremo' },
  ],
}

export default function MapaRiscoEstado({ uf }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const capital = UF_CAPITAL[uf] || uf
  const center = UF_CENTER[uf]
  const zones = CAPITAL_RISK_ZONES[uf] || []

  if (!center || zones.length === 0) return null

  const W = 460, H = 380
  const zoom = center.z

  function toXY(lat, lon) {
    const x = ((lon - center.lon) / zoom) * (W / 2) + W / 2
    const y = ((center.lat - lat) / zoom) * (H / 2) + H / 2
    return { x: Math.max(15, Math.min(W - 15, x)), y: Math.max(15, Math.min(H - 15, y)) }
  }

  const counts = { muito_alto: 0, alto: 0, medio: 0, baixo: 0 }
  zones.forEach(z => { counts[z.risco] = (counts[z.risco] || 0) + 1 })

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'" }}>Zonas de Risco — {capital}</span>
            <span style={{ display: 'block', fontSize: 10, color: '#999' }}>Bairros e regiões vulneráveis a eventos climáticos</span>
          </div>
        </div>
        <a href="https://georisk.cemaden.gov.br/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#0EA5E9', textDecoration: 'none', fontWeight: 500, background: '#F0F9FF', padding: '4px 10px', borderRadius: 6 }}>
          <ExternalLink size={10} /> CEMADEN
        </a>
      </div>

      {/* Map SVG */}
      <div style={{ position: 'relative', background: '#FAFAF8', borderRadius: 12, border: '1px solid #e8e8e4', overflow: 'hidden', marginBottom: 12 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {/* Grid */}
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i} opacity={0.3}>
              <line x1={(i + 1) * (W / 8)} y1={0} x2={(i + 1) * (W / 8)} y2={H} stroke="#ddd" strokeWidth={0.5} />
              <line x1={0} y1={(i + 1) * (H / 8)} x2={W} y2={(i + 1) * (H / 8)} stroke="#ddd" strokeWidth={0.5} />
            </g>
          ))}

          {/* City center marker */}
          <g>
            <circle cx={W / 2} cy={H / 2} r={3} fill="#888" opacity={0.4} />
            <text x={W / 2 + 6} y={H / 2 + 4} fontSize={8} fill="#aaa">Centro</text>
          </g>

          {/* Risk zones */}
          {zones.map((zone, i) => {
            const { x, y } = toXY(zone.lat, zone.lon)
            const rc = RISK_COLORS[zone.risco] || RISK_COLORS.medio
            const isHov = hoveredIdx === i
            const r = isHov ? 14 : 10

            return (
              <g key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Halo de risco */}
                <circle cx={x} cy={y} r={r + 8} fill={rc.fill} opacity={0.08} />
                {(zone.risco === 'muito_alto' || zone.risco === 'alto') && (
                  <circle cx={x} cy={y} r={r + 5} fill={rc.fill} opacity={0.12}>
                    <animate attributeName="r" values={`${r + 3};${r + 10};${r + 3}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Ponto principal */}
                <circle cx={x} cy={y} r={r} fill={rc.fill} stroke={rc.stroke} strokeWidth={2} opacity={0.8} />

                {/* Label do bairro */}
                <text x={x} y={y + r + 12} textAnchor="middle" fontSize={isHov ? 10 : 8} fill={isHov ? '#333' : '#999'} fontWeight={isHov ? 600 : 400}>
                  {zone.nome}
                </text>

                {/* Tooltip on hover */}
                {isHov && (
                  <g>
                    <rect x={x + 16} y={y - 32} width={Math.max(zone.tipo.length * 6.2, zone.nome.length * 7.5, 100)} height={44} rx={8} fill="white" stroke="#ddd" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
                    <text x={x + 22} y={y - 16} fontSize={11} fontWeight={700} fill="#333">{zone.nome}</text>
                    <text x={x + 22} y={y - 2} fontSize={9} fill={rc.fill} fontWeight={600}>{rc.label}</text>
                    <text x={x + 22} y={y + 10} fontSize={9} fill="#888">{zone.tipo}</text>
                  </g>
                )}
              </g>
            )
          })}

          {/* North + title */}
          <g transform={`translate(${W - 25}, 20)`}>
            <line x1={0} y1={10} x2={0} y2={-5} stroke="#bbb" strokeWidth={1.5} />
            <polygon points="0,-5 -3,0 3,0" fill="#bbb" />
            <text x={0} y={-8} textAnchor="middle" fontSize={7} fill="#bbb" fontWeight={600}>N</text>
          </g>
          <text x={12} y={16} fontSize={9} fill="#ccc" fontWeight={500}>{capital} — Mapa de Risco Climático</text>
        </svg>
      </div>

      {/* Legend + stats */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
        {Object.entries(RISK_COLORS).map(([key, rc]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: rc.bg, border: `1px solid ${rc.fill}22` }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: rc.fill }} />
            <span style={{ fontSize: 10, color: rc.fill, fontWeight: 600 }}>{rc.label}</span>
            <span style={{ fontSize: 10, color: '#999' }}>({counts[key]})</span>
          </div>
        ))}
      </div>

      {/* Risk list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {zones.filter(z => z.risco === 'muito_alto' || z.risco === 'alto').map((z, i) => {
          const rc = RISK_COLORS[z.risco]
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: rc.bg, border: `1px solid ${rc.fill}22`, fontSize: 11 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: rc.fill }} />
              <span style={{ fontWeight: 600, color: '#333' }}>{z.nome}</span>
              <span style={{ color: '#888', fontSize: 10 }}>— {z.tipo}</span>
              <span style={{ marginLeft: 'auto', color: rc.fill, fontWeight: 600, fontSize: 10 }}>{rc.label}</span>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 9, color: '#ccc', marginTop: 10 }}>
        Fonte: CEMADEN · SGB/CPRM · Defesa Civil Estadual · Dados de setorização de risco geo-hidrológico ·{' '}
        <a href="https://georisk.cemaden.gov.br/" target="_blank" rel="noopener noreferrer" style={{ color: '#0EA5E9' }}>Ver mapa interativo completo</a>
      </p>
    </div>
  )
}
