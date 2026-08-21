import { useState, useEffect } from 'react'
import { Thermometer, CloudRain, TrendingUp, TrendingDown, BarChart3, RefreshCw, Loader2, ChevronDown, ChevronUp, Droplets, Sun, Wind } from 'lucide-react'

/* ── IDs das capitais no sistema CPTEC ── */
const UF_CAPITAIS_CPTEC = {
  AC: 4052, AL: 3163, AM: 3464, AP: 2552, BA: 3849, CE: 3388,
  DF: 5254, ES: 5765, GO: 5247, MA: 3185, MG: 5543, MS: 5298,
  MT: 5029, PA: 3218, PB: 3311, PE: 3301, PI: 3294, PR: 5851,
  RJ: 5811, RN: 3349, RO: 4540, RR: 2490, RS: 6016, SC: 5886,
  SE: 3157, SP: 5779, TO: 4862,
}

const UF_CAPITAL_NOMES = {
  AC: 'Rio Branco', AL: 'Maceió', AM: 'Manaus', AP: 'Macapá',
  BA: 'Salvador', CE: 'Fortaleza', DF: 'Brasília', ES: 'Vitória',
  GO: 'Goiânia', MA: 'São Luís', MG: 'Belo Horizonte', MS: 'Campo Grande',
  MT: 'Cuiabá', PA: 'Belém', PB: 'João Pessoa', PE: 'Recife',
  PI: 'Teresina', PR: 'Curitiba', RJ: 'Rio de Janeiro', RN: 'Natal',
  RO: 'Porto Velho', RR: 'Boa Vista', RS: 'Porto Alegre', SC: 'Florianópolis',
  SE: 'Aracaju', SP: 'São Paulo', TO: 'Palmas',
}

/* ── Mapeamento condição CPTEC → precipitação estimada (mm/dia) ── */
const CONDICAO_PRECIP = {
  ec:  { min: 10, max: 30, label: 'Encoberto c/ chuva',    emoji: '🌧️', nivel: 'forte' },
  ci:  { min: 0,  max: 2,  label: 'Céu intermitente',      emoji: '⛅', nivel: 'nenhuma' },
  c:   { min: 5,  max: 20, label: 'Chuva',                 emoji: '🌧️', nivel: 'moderada' },
  in:  { min: 2,  max: 10, label: 'Instável',              emoji: '🌦️', nivel: 'leve' },
  pp:  { min: 0,  max: 0,  label: 'Pouco nublado',         emoji: '⛅', nivel: 'nenhuma' },
  cm:  { min: 5,  max: 15, label: 'Chuva pela manhã',      emoji: '🌧️', nivel: 'moderada' },
  cn:  { min: 5,  max: 15, label: 'Chuva à noite',         emoji: '🌧️', nivel: 'moderada' },
  pt:  { min: 5,  max: 25, label: 'Pancadas à tarde',      emoji: '⛈️', nivel: 'moderada' },
  pm:  { min: 5,  max: 25, label: 'Pancadas pela manhã',   emoji: '⛈️', nivel: 'moderada' },
  np:  { min: 5,  max: 20, label: 'Nublado c/ pancadas',   emoji: '⛈️', nivel: 'moderada' },
  pc:  { min: 5,  max: 30, label: 'Pancadas de chuva',     emoji: '⛈️', nivel: 'forte' },
  pn:  { min: 0,  max: 2,  label: 'Parcialmente nublado',  emoji: '⛅', nivel: 'nenhuma' },
  cv:  { min: 1,  max: 5,  label: 'Chuvisco',              emoji: '🌦️', nivel: 'leve' },
  ch:  { min: 10, max: 40, label: 'Chuvoso',               emoji: '🌧️', nivel: 'forte' },
  t:   { min: 15, max: 50, label: 'Tempestade',            emoji: '⛈️', nivel: 'extrema' },
  ps:  { min: 0,  max: 0,  label: 'Predomínio de sol',     emoji: '☀️', nivel: 'nenhuma' },
  e:   { min: 0,  max: 2,  label: 'Encoberto',             emoji: '☁️', nivel: 'nenhuma' },
  n:   { min: 0,  max: 5,  label: 'Neve',                  emoji: '❄️', nivel: 'leve' },
  cl:  { min: 0,  max: 0,  label: 'Céu limpo',             emoji: '☀️', nivel: 'nenhuma' },
  nd:  { min: 0,  max: 0,  label: 'Não definido',          emoji: '🌫️', nivel: 'nenhuma' },
  pnt: { min: 5,  max: 25, label: 'Pancadas noturnas',     emoji: '⛈️', nivel: 'moderada' },
  vn:  { min: 0,  max: 5,  label: 'Ventos fortes',         emoji: '🌬️', nivel: 'nenhuma' },
  ct:  { min: 15, max: 50, label: 'Chuva c/ trovoada',     emoji: '⛈️', nivel: 'extrema' },
  ppn: { min: 5,  max: 15, label: 'Chuva à noite',         emoji: '🌧️', nivel: 'moderada' },
  pcm: { min: 5,  max: 25, label: 'Pancadas pela manhã',   emoji: '⛈️', nivel: 'moderada' },
  ppt: { min: 5,  max: 25, label: 'Pancadas à tarde',      emoji: '⛈️', nivel: 'moderada' },
  psc: { min: 2,  max: 10, label: 'Possíveis chuvas',      emoji: '🌦️', nivel: 'leve' },
  pcn: { min: 5,  max: 25, label: 'Pancadas à noite',      emoji: '⛈️', nivel: 'moderada' },
  nv:  { min: 0,  max: 0,  label: 'Nevoeiro',              emoji: '🌁', nivel: 'nenhuma' },
  g:   { min: 0,  max: 0,  label: 'Geada',                 emoji: '🧊', nivel: 'nenhuma' },
  ne:  { min: 0,  max: 5,  label: 'Neve',                  emoji: '❄️', nivel: 'leve' },
}

const NIVEL_CORES = {
  nenhuma:  { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', label: 'Sem chuva' },
  leve:     { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', label: 'Chuva leve' },
  moderada: { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C', label: 'Chuva moderada' },
  forte:    { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', label: 'Chuva forte' },
  extrema:  { bg: '#FDF2F8', border: '#FBCFE8', text: '#BE185D', label: 'Tempestade' },
}

/* ── Climatologia mensal por UF (médias históricas INMET) ── */
const CLIM_REF = {
  AC: { max: [32,32,32,32,32,33,34,35,34,33,32,32], min: [22,22,22,22,21,20,19,20,21,22,22,22], precip: [260,260,260,210,100,30,20,30,70,150,200,250] },
  AL: { max: [31,31,31,30,29,27,27,27,28,29,30,31], min: [23,23,23,23,22,21,20,20,20,21,22,23], precip: [60,70,130,180,230,250,200,130,70,30,30,40] },
  AM: { max: [31,31,31,31,31,32,33,34,34,33,32,31], min: [24,24,24,24,24,23,23,23,24,24,24,24], precip: [290,290,310,300,250,110,60,40,80,130,180,240] },
  AP: { max: [30,30,30,31,32,33,34,34,34,34,33,31], min: [23,23,23,23,23,23,23,23,23,23,23,23], precip: [300,320,370,360,290,120,50,30,20,30,80,190] },
  BA: { max: [30,30,30,29,28,27,26,27,27,28,29,30], min: [24,24,24,23,22,21,21,21,21,22,23,24], precip: [100,110,140,170,220,210,180,110,80,70,80,90] },
  CE: { max: [31,30,30,30,30,30,30,31,32,32,32,31], min: [24,23,23,23,23,22,22,22,23,24,24,24], precip: [130,160,270,290,180,100,50,20,20,20,20,50] },
  DF: { max: [28,28,29,29,27,26,26,28,31,30,29,28], min: [18,18,18,17,14,12,12,13,16,18,18,18], precip: [240,210,180,120,30,5,5,10,40,170,240,260] },
  ES: { max: [32,33,32,30,28,27,26,27,27,28,29,31], min: [23,23,23,21,19,18,17,17,18,20,21,22], precip: [150,90,130,110,80,50,50,40,50,120,170,200] },
  GO: { max: [31,31,32,32,31,30,30,33,35,33,32,31], min: [20,20,20,19,16,14,13,15,18,20,20,20], precip: [270,230,200,110,30,10,5,10,40,160,230,280] },
  MA: { max: [31,30,30,30,31,32,33,34,35,34,33,32], min: [23,23,23,23,23,22,22,22,23,23,23,23], precip: [210,300,400,400,280,130,60,20,10,20,40,100] },
  MG: { max: [30,30,30,29,27,26,26,28,30,30,29,29], min: [19,19,19,17,14,12,12,13,16,17,18,19], precip: [300,190,170,60,20,10,10,10,40,110,230,340] },
  MS: { max: [33,33,33,32,29,27,28,30,32,33,33,33], min: [23,23,22,20,17,15,14,16,19,21,22,23], precip: [200,170,140,80,70,40,30,30,60,120,150,180] },
  MT: { max: [33,33,33,33,33,33,34,36,36,35,34,33], min: [23,23,23,22,20,18,17,19,22,23,23,23], precip: [290,260,230,110,40,10,5,15,50,140,220,280] },
  PA: { max: [31,31,31,31,32,33,33,34,34,34,33,32], min: [23,23,23,23,23,22,22,22,22,22,23,23], precip: [360,400,430,380,280,160,130,110,120,120,140,250] },
  PB: { max: [31,31,30,30,29,28,27,28,29,30,31,31], min: [24,24,23,23,22,21,20,21,21,22,23,24], precip: [50,70,110,140,150,170,150,80,30,10,10,20] },
  PE: { max: [31,31,31,30,29,28,27,28,29,30,31,31], min: [24,24,24,23,22,21,20,21,21,22,23,24], precip: [60,80,160,190,210,250,220,130,60,30,30,30] },
  PI: { max: [34,33,32,33,34,35,36,37,38,37,36,35], min: [23,23,23,22,21,20,19,20,22,23,23,23], precip: [190,200,260,190,60,10,5,5,10,50,100,150] },
  PR: { max: [28,28,27,25,22,20,21,22,23,25,26,28], min: [18,18,17,14,11,9,9,10,12,14,16,17], precip: [190,170,140,100,100,90,80,60,110,140,130,160] },
  RJ: { max: [32,33,31,29,27,26,26,26,26,27,29,31], min: [24,24,23,21,19,18,17,18,19,20,22,23], precip: [130,120,130,100,70,40,30,30,50,80,100,140] },
  RN: { max: [31,31,30,30,30,29,28,29,30,31,31,31], min: [24,23,23,23,22,21,21,21,22,23,23,24], precip: [60,90,160,170,130,100,80,30,10,10,10,30] },
  RO: { max: [31,31,32,32,32,32,33,35,34,33,32,31], min: [22,22,22,22,21,19,18,19,21,22,22,22], precip: [290,270,250,180,70,20,10,20,60,150,210,270] },
  RR: { max: [33,34,34,33,31,31,32,34,35,35,34,33], min: [24,24,24,24,23,23,23,23,23,24,24,24], precip: [20,30,60,110,220,290,270,180,90,60,60,30] },
  RS: { max: [31,30,28,25,22,19,20,21,22,24,27,29], min: [20,20,19,15,12,10,10,11,13,15,17,19], precip: [100,120,110,100,100,120,130,120,130,120,90,100] },
  SC: { max: [30,30,28,26,23,21,21,22,23,25,27,29], min: [21,21,19,17,14,11,11,12,14,16,18,20], precip: [180,190,160,100,90,80,90,90,130,150,140,160] },
  SE: { max: [30,31,31,30,28,27,26,27,28,29,30,30], min: [23,23,23,23,22,21,20,20,21,22,22,23], precip: [50,60,80,140,190,190,170,100,50,30,30,40] },
  SP: { max: [28,29,28,26,24,22,22,24,25,26,27,28], min: [19,19,18,16,13,11,11,12,14,15,17,18], precip: [240,220,160,60,50,40,30,30,60,130,150,200] },
  TO: { max: [32,32,32,33,33,34,35,37,37,35,33,32], min: [22,22,22,22,20,18,17,19,21,22,22,22], precip: [250,230,220,140,40,5,3,5,30,130,210,260] },
}

/* ── Componente de card de métrica ── */
function MetricCard({ icon: Icon, label, value, unit, sublabel, color, trend, small }) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e8e8e4', borderRadius: 12,
      padding: small ? 10 : 14, display: 'flex', flexDirection: 'column', gap: 3,
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Icon size={12} style={{ color }} />
        <span style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: "'DM Sans'", fontSize: small ? 17 : 20, fontWeight: 800, color: '#1a1a1a' }}>{value}</span>
        <span style={{ fontSize: 10, color: '#999' }}>{unit}</span>
        {trend != null && trend !== 0 && (
          <span style={{ fontSize: 9, color: trend > 0 ? '#EF4444' : '#3B82F6', display: 'flex', alignItems: 'center', gap: 1, marginLeft: 'auto' }}>
            {trend > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {trend > 0 ? '+' : ''}{trend}°C
          </span>
        )}
      </div>
      {sublabel && <span style={{ fontSize: 9, color: '#bbb' }}>{sublabel}</span>}
    </div>
  )
}

/* ── Linha de previsão diária ── */
function ForecastDay({ dia }) {
  const cond = CONDICAO_PRECIP[dia.condicao] || CONDICAO_PRECIP.nd
  const nivel = NIVEL_CORES[cond.nivel] || NIVEL_CORES.nenhuma
  const maxColor = dia.max >= 35 ? '#EF4444' : dia.max >= 30 ? '#F59E0B' : '#0EA5E9'
  const minColor = dia.min <= 10 ? '#3B82F6' : dia.min <= 18 ? '#0EA5E9' : '#22C55E'
  const dateStr = new Date(dia.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      background: '#FAFAF8', borderRadius: 10, flexWrap: 'wrap',
    }}>
      {/* Emoji + data */}
      <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{cond.emoji}</span>
      <div style={{ minWidth: 90 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block' }}>{dateStr}</span>
        <span style={{ fontSize: 10, color: '#999' }}>{cond.label}</span>
      </div>

      {/* Barra de temperatura */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, flex: 1, minWidth: 130 }}>
        <span style={{ color: minColor, width: 28, textAlign: 'right' }}>{dia.min}°</span>
        <div style={{ flex: 1, height: 5, background: '#eee', borderRadius: 3, position: 'relative', maxWidth: 80 }}>
          <div style={{
            position: 'absolute', left: `${Math.max(0, (dia.min / 45) * 100)}%`,
            width: `${Math.max(8, ((dia.max - dia.min) / 45) * 100)}%`,
            height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${minColor}, ${maxColor})`,
          }} />
        </div>
        <span style={{ color: maxColor, width: 28 }}>{dia.max}°</span>
      </div>

      {/* Precipitação estimada */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 6,
        background: nivel.bg, border: `1px solid ${nivel.border}`,
        fontSize: 10, fontWeight: 600, color: nivel.text, minWidth: 80,
      }}>
        <Droplets size={10} />
        {cond.min === 0 && cond.max === 0
          ? nivel.label
          : `${cond.min}–${cond.max} mm`
        }
      </div>

      {/* UV alto */}
      {dia.iuv != null && dia.iuv >= 8 && (
        <span style={{ fontSize: 9, background: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Sun size={9} /> UV {dia.iuv}
        </span>
      )}
    </div>
  )
}

/* ── Componente principal ── */
export default function DadosCPTEC({ uf }) {
  const [previsao4, setPrevisao4] = useState(null)
  const [previsao6, setPrevisao6] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [expandido, setExpandido] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const cidadeId = UF_CAPITAIS_CPTEC[uf]
  const cidadeNome = UF_CAPITAL_NOMES[uf] || uf

  async function fetchDados() {
    if (!cidadeId) { setErro('Cidade não mapeada'); setLoading(false); return }
    setLoading(true)
    setErro(null)

    try {
      // Buscar previsão 4 dias + estendida 6 dias em paralelo
      const [res4, res6] = await Promise.allSettled([
        fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${cidadeId}`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
        fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${cidadeId}/6`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      ])

      const data4 = res4.status === 'fulfilled' ? res4.value : null
      const data6 = res6.status === 'fulfilled' ? res6.value : null

      if (!data4 && !data6) throw new Error('Nenhuma previsão disponível')

      setPrevisao4(data4)
      setPrevisao6(data6)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Erro CPTEC:', err)
      setErro(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDados() }, [uf])

  /* ── Loading / erro states ── */
  if (loading && !previsao4 && !previsao6) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <SectionHeader cidadeNome={cidadeNome} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24, color: '#999' }}>
          <Loader2 size={16} className="animate-spin" />
          <span style={{ fontSize: 12 }}>Carregando dados do CPTEC para {cidadeNome}...</span>
        </div>
      </div>
    )
  }

  if (erro && !previsao4 && !previsao6) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <SectionHeader cidadeNome={cidadeNome} />
        <p style={{ fontSize: 11, color: '#999' }}>Dados indisponíveis. <button onClick={fetchDados} style={{ color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 11 }}>Tentar novamente</button></p>
      </div>
    )
  }

  /* ── Juntar dias únicos (priorizando estendida) ── */
  const dias4 = (previsao4?.clima || previsao4)?.previsao || []
  const dias6 = (previsao6?.clima || previsao6)?.previsao || []
  const diasMap = new Map()
  for (const d of dias4) diasMap.set(d.data, d)
  for (const d of dias6) diasMap.set(d.data, d) // sobrescreve se duplicar
  const dias = [...diasMap.values()].sort((a, b) => a.data.localeCompare(b.data))

  if (dias.length === 0) return null

  /* ── Calcular métricas ── */
  const temps = dias.filter(d => d.max != null && d.min != null)
  const tempMax = temps.length ? Math.max(...temps.map(d => d.max)) : null
  const tempMin = temps.length ? Math.min(...temps.map(d => d.min)) : null
  const tempMediaMax = temps.length ? Math.round(temps.reduce((a, d) => a + d.max, 0) / temps.length) : null
  const tempMediaMin = temps.length ? Math.round(temps.reduce((a, d) => a + d.min, 0) / temps.length) : null

  // Precipitação estimada pelo código de condição
  const precipDias = dias.map(d => {
    const cond = CONDICAO_PRECIP[d.condicao] || { min: 0, max: 0 }
    return { ...d, precipMin: cond.min, precipMax: cond.max }
  })
  const precipMaxPeriodo = Math.max(...precipDias.map(d => d.precipMax))
  const precipMinPeriodo = Math.min(...precipDias.map(d => d.precipMin))
  const precipAcumMax = precipDias.reduce((s, d) => s + d.precipMax, 0)
  const precipAcumMin = precipDias.reduce((s, d) => s + d.precipMin, 0)

  // Climatologia
  const mesAtual = new Date().getMonth()
  const climRef = CLIM_REF[uf]
  const climMax = climRef ? climRef.max[mesAtual] : null
  const climMin = climRef ? climRef.min[mesAtual] : null
  const climPrecip = climRef ? climRef.precip[mesAtual] : null
  const anomMax = climMax != null && tempMediaMax != null ? tempMediaMax - climMax : null
  const anomMin = climMin != null && tempMediaMin != null ? tempMediaMin - climMin : null
  const mesNome = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][mesAtual]

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionHeader cidadeNome={cidadeNome} />
        <button onClick={fetchDados} style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Atualizar">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ═══ BLOCO 1: Temperaturas previstas ═══ */}
      <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>
        🌡️ Temperatura prevista — próximos {dias.length} dias
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <MetricCard icon={Thermometer} label="Máx. prevista" value={tempMax} unit="°C" color="#EF4444" sublabel="Maior do período" small />
        <MetricCard icon={Thermometer} label="Mín. prevista" value={tempMin} unit="°C" color="#3B82F6" sublabel="Menor do período" small />
        <MetricCard icon={Thermometer} label="Média das máx." value={tempMediaMax} unit="°C" color="#F59E0B" sublabel={`Média ${dias.length} dias`} small />
        <MetricCard icon={Thermometer} label="Média das mín." value={tempMediaMin} unit="°C" color="#0EA5E9" sublabel={`Média ${dias.length} dias`} small />
      </div>

      {/* ═══ BLOCO 2: Precipitação estimada ═══ */}
      <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>
        🌧️ Precipitação estimada (baseada nas condições previstas)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <MetricCard icon={Droplets} label="Precip. máx/dia" value={precipMaxPeriodo} unit="mm" color="#2563EB" sublabel="Maior prevista (1 dia)" small />
        <MetricCard icon={Droplets} label="Precip. mín/dia" value={precipMinPeriodo} unit="mm" color="#7DD3FC" sublabel="Menor prevista (1 dia)" small />
        <MetricCard icon={CloudRain} label="Acumulada máx." value={precipAcumMax} unit="mm" color="#1D4ED8" sublabel={`Total ${dias.length} dias`} small />
        <MetricCard icon={CloudRain} label="Acumulada mín." value={precipAcumMin} unit="mm" color="#93C5FD" sublabel={`Total ${dias.length} dias`} small />
      </div>

      {/* ═══ BLOCO 3: Climatologia ═══ */}
      {climRef && (
        <>
          <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>
            📊 Climatologia ({mesNome}) e Anomalias
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
            <MetricCard icon={BarChart3} label={`Clim. máx. (${mesNome})`} value={climMax} unit="°C" color="#8B5CF6" sublabel="Média histórica INMET" small />
            <MetricCard icon={BarChart3} label={`Clim. mín. (${mesNome})`} value={climMin} unit="°C" color="#6366F1" sublabel="Média histórica INMET" small />
            <MetricCard icon={Droplets} label={`Precip. clim. (${mesNome})`} value={climPrecip} unit="mm" color="#7C3AED" sublabel="Acum. mensal histórico" small />
          </div>

          {/* Anomalias */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {anomMax != null && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: anomMax > 0 ? '#FEF2F2' : anomMax < 0 ? '#EFF6FF' : '#F9FAFB',
                border: `1px solid ${anomMax > 0 ? '#FECACA' : anomMax < 0 ? '#BFDBFE' : '#E5E7EB'}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                {anomMax > 0 ? <TrendingUp size={14} style={{ color: '#EF4444' }} /> : anomMax < 0 ? <TrendingDown size={14} style={{ color: '#3B82F6' }} /> : <BarChart3 size={14} style={{ color: '#6B7280' }} />}
                <div>
                  <span style={{ fontSize: 9, color: '#888', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Anomalia Temp. Máxima</span>
                  <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'DM Sans'", color: anomMax > 0 ? '#DC2626' : anomMax < 0 ? '#2563EB' : '#6B7280' }}>
                    {anomMax > 0 ? '+' : ''}{anomMax}°C
                  </span>
                  <span style={{ fontSize: 9, color: '#aaa', display: 'block' }}>
                    Previsão {tempMediaMax}° vs clim. {climMax}°
                  </span>
                </div>
              </div>
            )}
            {anomMin != null && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: anomMin > 0 ? '#FEF2F2' : anomMin < 0 ? '#EFF6FF' : '#F9FAFB',
                border: `1px solid ${anomMin > 0 ? '#FECACA' : anomMin < 0 ? '#BFDBFE' : '#E5E7EB'}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                {anomMin > 0 ? <TrendingUp size={14} style={{ color: '#EF4444' }} /> : anomMin < 0 ? <TrendingDown size={14} style={{ color: '#3B82F6' }} /> : <BarChart3 size={14} style={{ color: '#6B7280' }} />}
                <div>
                  <span style={{ fontSize: 9, color: '#888', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Anomalia Temp. Mínima</span>
                  <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'DM Sans'", color: anomMin > 0 ? '#DC2626' : anomMin < 0 ? '#2563EB' : '#6B7280' }}>
                    {anomMin > 0 ? '+' : ''}{anomMin}°C
                  </span>
                  <span style={{ fontSize: 9, color: '#aaa', display: 'block' }}>
                    Previsão {tempMediaMin}° vs clim. {climMin}°
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ BLOCO 4: Previsão dia a dia ═══ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          📅 Previsão diária — {cidadeNome}
        </span>
        {dias.length > 3 && (
          <button
            onClick={() => setExpandido(!expandido)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {expandido ? 'Recolher' : `Ver todos (${dias.length} dias)`}
            {expandido ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {(expandido ? dias : dias.slice(0, 3)).map((dia, i) => (
          <ForecastDay key={i} dia={dia} />
        ))}
      </div>

      <p style={{ fontSize: 9, color: '#ccc', marginTop: 10 }}>
        Fonte: CPTEC/INPE via BrasilAPI · Climatologia: médias históricas INMET · Precipitação estimada por condição meteorológica · Atualizado: {lastUpdate?.toLocaleTimeString('pt-BR') || '—'}
      </p>
    </div>
  )
}

function SectionHeader({ cidadeNome }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <CloudRain size={16} style={{ color: '#0EA5E9' }} />
      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'" }}>Previsão CPTEC/INPE</span>
      <span style={{ fontSize: 9, background: '#F0F9FF', color: '#0EA5E9', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>NOVO</span>
      {cidadeNome && <span style={{ fontSize: 10, color: '#bbb', marginLeft: 'auto' }}>{cidadeNome}</span>}
    </div>
  )
}
