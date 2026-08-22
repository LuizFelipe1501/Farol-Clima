import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const RISK_COLORS = {
  muito_alto: { fill: '#DC2626', label: 'Muito Alto', bg: '#FEF2F2' },
  alto:       { fill: '#F97316', label: 'Alto', bg: '#FFF7ED' },
  medio:      { fill: '#EAB308', label: 'Médio', bg: '#FEFCE8' },
  baixo:      { fill: '#22C55E', label: 'Baixo', bg: '#F0FDF4' },
}

const UF_CAPITAL = {
  AC:'Rio Branco',AL:'Maceió',AM:'Manaus',AP:'Macapá',BA:'Salvador',CE:'Fortaleza',
  DF:'Brasília',ES:'Vitória',GO:'Goiânia',MA:'São Luís',MG:'Belo Horizonte',MS:'Campo Grande',
  MT:'Cuiabá',PA:'Belém',PB:'João Pessoa',PE:'Recife',PI:'Teresina',PR:'Curitiba',
  RJ:'Rio de Janeiro',RN:'Natal',RO:'Porto Velho',RR:'Boa Vista',RS:'Porto Alegre',
  SC:'Florianópolis',SE:'Aracaju',SP:'São Paulo',TO:'Palmas',
}

const UF_CENTER = {
  AC:{lat:-9.975,lon:-67.81,zoom:12}, AL:{lat:-9.666,lon:-35.735,zoom:13},
  AM:{lat:-3.119,lon:-60.022,zoom:12}, AP:{lat:0.034,lon:-51.066,zoom:13},
  BA:{lat:-12.972,lon:-38.512,zoom:12}, CE:{lat:-3.717,lon:-38.543,zoom:12},
  DF:{lat:-15.793,lon:-47.882,zoom:12}, ES:{lat:-20.319,lon:-40.338,zoom:13},
  GO:{lat:-16.686,lon:-49.264,zoom:12}, MA:{lat:-2.530,lon:-44.282,zoom:12},
  MG:{lat:-19.920,lon:-43.938,zoom:12}, MS:{lat:-20.469,lon:-54.620,zoom:12},
  MT:{lat:-15.601,lon:-56.097,zoom:12}, PA:{lat:-1.456,lon:-48.502,zoom:12},
  PB:{lat:-7.115,lon:-34.863,zoom:13}, PE:{lat:-8.054,lon:-34.871,zoom:12},
  PI:{lat:-5.092,lon:-42.803,zoom:12}, PR:{lat:-25.428,lon:-49.273,zoom:12},
  RJ:{lat:-22.907,lon:-43.173,zoom:12}, RN:{lat:-5.795,lon:-35.209,zoom:13},
  RO:{lat:-8.762,lon:-63.904,zoom:12}, RR:{lat:2.819,lon:-60.673,zoom:13},
  RS:{lat:-30.033,lon:-51.230,zoom:12}, SC:{lat:-27.595,lon:-48.548,zoom:13},
  SE:{lat:-10.909,lon:-37.072,zoom:13}, SP:{lat:-23.551,lon:-46.634,zoom:11},
  TO:{lat:-10.184,lon:-48.334,zoom:12},
}

const ZONES = {
  SP: [
    {nome:'Brasilândia',lat:-23.468,lon:-46.680,risco:'muito_alto',tipo:'Deslizamento/Alagamento'},
    {nome:'M\'Boi Mirim',lat:-23.680,lon:-46.740,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Ipiranga (várzea)',lat:-23.595,lon:-46.603,risco:'alto',tipo:'Enchente'},
    {nome:'Jardim Ângela',lat:-23.715,lon:-46.755,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Parelheiros',lat:-23.820,lon:-46.730,risco:'alto',tipo:'Deslizamento'},
    {nome:'Capão Redondo',lat:-23.680,lon:-46.780,risco:'alto',tipo:'Alagamento'},
    {nome:'Cidade Ademar',lat:-23.665,lon:-46.658,risco:'alto',tipo:'Alagamento'},
    {nome:'Tremembé',lat:-23.440,lon:-46.633,risco:'medio',tipo:'Deslizamento'},
    {nome:'Pinheiros (Marginal)',lat:-23.565,lon:-46.692,risco:'medio',tipo:'Enchente'},
    {nome:'Lapa',lat:-23.520,lon:-46.700,risco:'medio',tipo:'Enchente'},
    {nome:'Vila Prudente',lat:-23.585,lon:-46.580,risco:'baixo',tipo:'Alagamento pontual'},
    {nome:'Mooca',lat:-23.558,lon:-46.598,risco:'baixo',tipo:'Enchente controlada'},
  ],
  RJ: [
    {nome:'Rocinha',lat:-22.987,lon:-43.247,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Vidigal',lat:-22.993,lon:-43.232,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Santa Teresa',lat:-22.922,lon:-43.186,risco:'alto',tipo:'Deslizamento'},
    {nome:'Praça da Bandeira',lat:-22.911,lon:-43.201,risco:'alto',tipo:'Enchente'},
    {nome:'Rio Comprido',lat:-22.918,lon:-43.196,risco:'alto',tipo:'Enchente'},
    {nome:'Jacarepaguá',lat:-22.948,lon:-43.370,risco:'medio',tipo:'Alagamento'},
    {nome:'Campo Grande',lat:-22.901,lon:-43.560,risco:'medio',tipo:'Enchente'},
    {nome:'Barra da Tijuca',lat:-23.003,lon:-43.365,risco:'baixo',tipo:'Alagamento pontual'},
  ],
  MG: [
    {nome:'Barreiro',lat:-20.016,lon:-44.019,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Venda Nova',lat:-19.847,lon:-43.962,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Ribeirão Arrudas',lat:-19.924,lon:-43.958,risco:'alto',tipo:'Enchente'},
    {nome:'Pampulha',lat:-19.854,lon:-43.973,risco:'medio',tipo:'Alagamento'},
    {nome:'Regional Leste',lat:-19.919,lon:-43.900,risco:'alto',tipo:'Deslizamento'},
  ],
  RS: [
    {nome:'Centro Histórico',lat:-30.030,lon:-51.230,risco:'muito_alto',tipo:'Enchente (2024)'},
    {nome:'Sarandi',lat:-29.975,lon:-51.130,risco:'muito_alto',tipo:'Enchente'},
    {nome:'Humaitá',lat:-30.015,lon:-51.243,risco:'muito_alto',tipo:'Enchente Guaíba'},
    {nome:'Navegantes',lat:-29.998,lon:-51.186,risco:'alto',tipo:'Enchente'},
    {nome:'Cristal',lat:-30.078,lon:-51.233,risco:'alto',tipo:'Enchente Guaíba'},
    {nome:'Restinga',lat:-30.130,lon:-51.190,risco:'medio',tipo:'Alagamento'},
  ],
  BA: [
    {nome:'Bairro da Paz',lat:-12.925,lon:-38.388,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Saramandaia',lat:-12.968,lon:-38.458,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Calabar',lat:-13.002,lon:-38.508,risco:'alto',tipo:'Deslizamento'},
    {nome:'Subúrbio (Periperi)',lat:-12.903,lon:-38.516,risco:'alto',tipo:'Deslizamento/Enchente'},
    {nome:'Boca do Rio',lat:-12.979,lon:-38.426,risco:'medio',tipo:'Alagamento costeiro'},
  ],
  PE: [
    {nome:'Jardim Monte Verde',lat:-8.080,lon:-35.010,risco:'muito_alto',tipo:'Deslizamento (2022)'},
    {nome:'Ibura',lat:-8.103,lon:-34.944,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Areias',lat:-8.077,lon:-34.918,risco:'alto',tipo:'Enchente'},
    {nome:'Dois Unidos',lat:-7.994,lon:-34.892,risco:'alto',tipo:'Deslizamento'},
    {nome:'Boa Viagem',lat:-8.110,lon:-34.893,risco:'medio',tipo:'Erosão costeira'},
  ],
  PA: [
    {nome:'Guamá',lat:-1.440,lon:-48.480,risco:'muito_alto',tipo:'Alagamento/Maré'},
    {nome:'Terra Firme',lat:-1.438,lon:-48.475,risco:'muito_alto',tipo:'Alagamento'},
    {nome:'Jurunas',lat:-1.467,lon:-48.503,risco:'alto',tipo:'Alagamento'},
    {nome:'Ver-o-Peso',lat:-1.452,lon:-48.505,risco:'medio',tipo:'Maré alta'},
  ],
  AM: [
    {nome:'Educandos',lat:-3.135,lon:-60.010,risco:'muito_alto',tipo:'Enchente/Cheia'},
    {nome:'São Raimundo',lat:-3.115,lon:-60.040,risco:'muito_alto',tipo:'Enchente'},
    {nome:'Compensa',lat:-3.113,lon:-60.055,risco:'alto',tipo:'Alagamento'},
    {nome:'Centro',lat:-3.130,lon:-60.022,risco:'medio',tipo:'Cheia sazonal'},
  ],
  DF: [
    {nome:'Estrutural',lat:-15.783,lon:-47.995,risco:'alto',tipo:'Erosão/Alagamento'},
    {nome:'Sol Nascente',lat:-15.805,lon:-48.080,risco:'alto',tipo:'Ocupação irregular'},
    {nome:'Vicente Pires',lat:-15.800,lon:-48.065,risco:'medio',tipo:'Enchente urbana'},
  ],
  PR: [
    {nome:'Cajuru',lat:-25.460,lon:-49.225,risco:'alto',tipo:'Enchente'},
    {nome:'Uberaba',lat:-25.470,lon:-49.230,risco:'alto',tipo:'Enchente do Iguaçu'},
    {nome:'CIC',lat:-25.475,lon:-49.345,risco:'medio',tipo:'Alagamento'},
  ],
  SC: [
    {nome:'Maciço Morro da Cruz',lat:-27.585,lon:-48.555,risco:'muito_alto',tipo:'Deslizamento'},
    {nome:'Costeira',lat:-27.620,lon:-48.535,risco:'alto',tipo:'Deslizamento'},
    {nome:'Ingleses',lat:-27.435,lon:-48.395,risco:'medio',tipo:'Erosão costeira'},
  ],
  CE: [
    {nome:'Barra do Ceará',lat:-3.690,lon:-38.583,risco:'alto',tipo:'Erosão costeira'},
    {nome:'Pirambu',lat:-3.714,lon:-38.552,risco:'alto',tipo:'Enchente/Erosão'},
    {nome:'Conjunto Ceará',lat:-3.780,lon:-38.612,risco:'medio',tipo:'Alagamento'},
  ],
  GO: [
    {nome:'Jardim Novo Mundo',lat:-16.658,lon:-49.225,risco:'alto',tipo:'Enchente'},
    {nome:'Vila Mutirão',lat:-16.645,lon:-49.310,risco:'alto',tipo:'Alagamento'},
  ],
}

const RISK_RADIUS = { muito_alto: 800, alto: 600, medio: 500, baixo: 400 }

function RecenterMap({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

function FlyToZone({ zone }) {
  const map = useMap()
  if (zone) {
    map.flyTo([zone.lat, zone.lon], 15, { duration: 0.8 })
  }
  return null
}

export default function MapaRiscoEstado({ uf }) {
  const [focusedZone, setFocusedZone] = useState(null)
  const capital = UF_CAPITAL[uf] || uf
  const center = UF_CENTER[uf]
  const zones = ZONES[uf] || []

  const counts = useMemo(() => {
    const c = { muito_alto: 0, alto: 0, medio: 0, baixo: 0 }
    zones.forEach(z => { c[z.risco] = (c[z.risco] || 0) + 1 })
    return c
  }, [zones])

  if (!center) return (
    <div className="card" style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 13 }}>
      <AlertTriangle size={20} style={{ margin: '0 auto 8px', color: '#ddd' }} />
      Mapa de risco não disponível para {capital}
    </div>
  )

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans'" }}>Zonas de Risco — {capital}</span>
            <span style={{ display: 'block', fontSize: 10, color: '#999' }}>Bairros vulneráveis a eventos climáticos</span>
          </div>
        </div>
        <a href="https://georisk.cemaden.gov.br/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#0EA5E9', textDecoration: 'none', fontWeight: 500, background: '#F0F9FF', padding: '4px 10px', borderRadius: 6 }}>
          <ExternalLink size={10} /> CEMADEN
        </a>
      </div>

      {/* Mapa Leaflet */}
      <div style={{ height: 380, width: '100%' }}>
        <MapContainer
          center={[center.lat, center.lon]}
          zoom={center.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <RecenterMap center={[center.lat, center.lon]} zoom={center.zoom} />
          <FlyToZone zone={focusedZone} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones.map((zone, i) => {
            const rc = RISK_COLORS[zone.risco]
            const radius = RISK_RADIUS[zone.risco] || 500
            return (
              <CircleMarker
                key={i}
                center={[zone.lat, zone.lon]}
                radius={zone.risco === 'muito_alto' ? 12 : zone.risco === 'alto' ? 10 : 8}
                pathOptions={{
                  color: rc.fill,
                  fillColor: rc.fill,
                  fillOpacity: 0.5,
                  weight: 2,
                }}
              >
                <Popup>
                  <div style={{ fontFamily: "'Inter', sans-serif", minWidth: 160 }}>
                    <strong style={{ fontSize: 13 }}>{zone.nome}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: rc.fill, display: 'inline-block' }} />
                      <span style={{ fontSize: 11, color: rc.fill, fontWeight: 600 }}>{rc.label}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#666', marginTop: 4, marginBottom: 0 }}>{zone.tipo}</p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Legenda + lista */}
      <div style={{ padding: '12px 20px 16px' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
          {Object.entries(RISK_COLORS).map(([key, rc]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 8, background: rc.bg, fontSize: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: rc.fill }} />
              <span style={{ color: rc.fill, fontWeight: 600 }}>{rc.label}</span>
              <span style={{ color: '#999' }}>({counts[key]})</span>
            </div>
          ))}
        </div>

        {/* Lista das zonas críticas — clique para navegar no mapa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {zones.filter(z => z.risco === 'muito_alto' || z.risco === 'alto').map((z, i) => {
            const rc = RISK_COLORS[z.risco]
            const isFocused = focusedZone?.nome === z.nome
            return (
              <div
                key={i}
                onClick={() => setFocusedZone(z)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 12px', borderRadius: 8,
                  background: isFocused ? rc.fill + '20' : rc.bg,
                  border: isFocused ? `2px solid ${rc.fill}` : `1px solid transparent`,
                  fontSize: 11, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: rc.fill, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, color: '#333' }}>{z.nome}</span>
                <span style={{ color: '#888', fontSize: 10 }}>— {z.tipo}</span>
                <span style={{ marginLeft: 'auto', color: rc.fill, fontWeight: 600, fontSize: 10, flexShrink: 0 }}>
                  {isFocused ? '📍 Focado' : rc.label}
                </span>
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: 9, color: '#aaa', marginTop: 6 }}>Clique em uma zona para navegar até ela no mapa ↑</p>

        <p style={{ fontSize: 9, color: '#ccc', marginTop: 8 }}>
          Fonte: CEMADEN · SGB/CPRM · Defesa Civil ·{' '}
          <a href="https://georisk.cemaden.gov.br/" target="_blank" rel="noopener noreferrer" style={{ color: '#0EA5E9' }}>Mapa interativo completo</a>
        </p>
      </div>
    </div>
  )
}
