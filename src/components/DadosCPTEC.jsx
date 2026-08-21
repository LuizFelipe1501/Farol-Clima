import { useState, useEffect } from 'react'
import { Thermometer, CloudRain, TrendingUp, TrendingDown, BarChart3, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

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

function MetricCard({ icon: Icon, label, value, unit, sublabel, color, trend }) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e8e8e4', borderRadius: 12,
      padding: 14, display: 'flex', flexDirection: 'column', gap: 4,
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} style={{ color }} />
        <span style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>{value}</span>
        <span style={{ fontSize: 11, color: '#999' }}>{unit}</span>
        {trend && (
          <span style={{ fontSize: 10, color: trend > 0 ? '#EF4444' : '#22C55E', display: 'flex', alignItems: 'center', gap: 1, marginLeft: 'auto' }}>
            {trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend > 0 ? '+' : ''}{trend}°C
          </span>
        )}
      </div>
      {sublabel && <span style={{ fontSize: 10, color: '#bbb' }}>{sublabel}</span>}
    </div>
  )
}

function ForecastDay({ dia }) {
  const maxColor = dia.max >= 35 ? '#EF4444' : dia.max >= 30 ? '#F59E0B' : '#0EA5E9'
  const minColor = dia.min <= 10 ? '#3B82F6' : dia.min <= 18 ? '#0EA5E9' : '#22C55E'
  
  const dateStr = new Date(dia.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
  
  const condicaoEmoji = {
    'ec': '⛅', 'ci': '🌤️', 'c': '🌞', 'in': '☁️', 'pp': '☁️', 'cm': '🌧️',
    'cn': '🌧️', 'pt': '🌧️', 'pm': '🌧️', 'np': '🌧️', 'pc': '⛈️',
    'pn': '⛈️', 'cv': '🌧️', 'ch': '🌧️', 't': '⛈️', 'ps': '🌦️',
    'e': '☀️', 'n': '❄️', 'cl': '☀️', 'nd': '🌫️', 'pnt': '⛈️',
    'vn': '🌬️', 'ct': '⛈️', 'ppn': '🌧️', 'pcm': '🌧️', 'ppt': '⛈️',
    'psc': '🌦️', 'pcn': '🌧️', 'nv': '🌁', 'g': '🧊', 'ne': '🌫️',
  }
  const emoji = condicaoEmoji[dia.condicao] || '🌤️'
  const condicaoLabels = {
    'ec': 'Encoberto com chuvas', 'ci': 'Céu intermitente', 'c': 'Chuva',
    'in': 'Instável', 'pp': 'Pouco nublado', 'cm': 'Chuva pela manhã',
    'cn': 'Chuva à noite', 'pt': 'Pancadas de chuva à tarde', 'pm': 'Pancadas pela manhã',
    'np': 'Nublado e pancadas', 'pc': 'Pancadas de chuva', 'pn': 'Parcialmente nublado',
    'cv': 'Chuvisco', 'ch': 'Chuvoso', 't': 'Tempestade', 'ps': 'Predomínio de sol',
    'e': 'Encoberto', 'n': 'Neve', 'cl': 'Céu limpo', 'nd': 'Não definido',
    'pnt': 'Pancadas noturnas', 'vn': 'Ventos fortes', 'ct': 'Chuva e trovoada',
    'ppn': 'Chuva à noite', 'pcm': 'Pancadas pela manhã', 'ppt': 'Pancadas à tarde',
    'psc': 'Possíveis chuvas', 'pcn': 'Pancadas à noite', 'nv': 'Nevoeiro',
    'g': 'Geada', 'ne': 'Neve',
  }
  const condLabel = condicaoLabels[dia.condicao] || dia.condicao_desc || dia.condicao || ''

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px',
      background: '#FAFAF8', borderRadius: 10,
    }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#555' }}>{dateStr}</span>
        <span style={{ fontSize: 10, color: '#999', display: 'block' }}>{condLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
        <span style={{ color: minColor }}>{dia.min}°</span>
        <div style={{ width: 40, height: 4, background: '#eee', borderRadius: 2, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: `${Math.max(0, (dia.min / 45) * 100)}%`,
            width: `${Math.max(10, ((dia.max - dia.min) / 45) * 100)}%`,
            height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${minColor}, ${maxColor})`,
          }} />
        </div>
        <span style={{ color: maxColor }}>{dia.max}°</span>
      </div>
      {dia.iuv != null && dia.iuv >= 8 && (
        <span style={{ fontSize: 9, background: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
          UV {dia.iuv}
        </span>
      )}
    </div>
  )
}

export default function DadosCPTEC({ uf }) {
  const [previsao, setPrevisao] = useState(null)
  const [ondas, setOndas] = useState(null)
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
      const [resPrev] = await Promise.all([
        fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${cidadeId}`),
      ])

      if (!resPrev.ok) throw new Error(`Erro ${resPrev.status} ao buscar previsão`)

      const dataPrev = await resPrev.json()
      setPrevisao(dataPrev)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Erro CPTEC:', err)
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDados() }, [uf])

  if (erro && !previsao) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <CloudRain size={16} style={{ color: '#0EA5E9' }} />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'" }}>Previsão CPTEC/INPE</span>
          <span style={{ fontSize: 9, background: '#F0F9FF', color: '#0EA5E9', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>NOVO</span>
        </div>
        <p style={{ fontSize: 11, color: '#999' }}>Dados indisponíveis no momento. <button onClick={fetchDados} style={{ color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 11 }}>Tentar novamente</button></p>
      </div>
    )
  }

  if (loading && !previsao) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <CloudRain size={16} style={{ color: '#0EA5E9' }} />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'" }}>Previsão CPTEC/INPE</span>
          <span style={{ fontSize: 9, background: '#F0F9FF', color: '#0EA5E9', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>NOVO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24, color: '#999' }}>
          <Loader2 size={16} className="animate-spin" />
          <span style={{ fontSize: 12 }}>Carregando dados do CPTEC para {cidadeNome}...</span>
        </div>
      </div>
    )
  }

  if (!previsao) return null

  const clima = previsao.clima || previsao
  const dias = clima?.previsao || []
  
  // Calculate summary metrics
  const temps = dias.filter(d => d.max != null && d.min != null)
  const tempMax = temps.length ? Math.max(...temps.map(d => d.max)) : null
  const tempMin = temps.length ? Math.min(...temps.map(d => d.min)) : null
  const tempMediaMax = temps.length ? Math.round(temps.reduce((a, d) => a + d.max, 0) / temps.length) : null
  const tempMediaMin = temps.length ? Math.round(temps.reduce((a, d) => a + d.min, 0) / temps.length) : null
  const amplitude = tempMax != null && tempMin != null ? tempMax - tempMin : null

  // Climatology reference (approximate monthly averages for Brazilian capitals)
  const mesAtual = new Date().getMonth()
  const CLIM_REF = {
    AC: { max: [32,32,32,32,32,33,34,35,34,33,32,32], min: [22,22,22,22,21,20,19,20,21,22,22,22] },
    AL: { max: [31,31,31,30,29,27,27,27,28,29,30,31], min: [23,23,23,23,22,21,20,20,20,21,22,23] },
    AM: { max: [31,31,31,31,31,32,33,34,34,33,32,31], min: [24,24,24,24,24,23,23,23,24,24,24,24] },
    AP: { max: [30,30,30,31,32,33,34,34,34,34,33,31], min: [23,23,23,23,23,23,23,23,23,23,23,23] },
    BA: { max: [30,30,30,29,28,27,26,27,27,28,29,30], min: [24,24,24,23,22,21,21,21,21,22,23,24] },
    CE: { max: [31,30,30,30,30,30,30,31,32,32,32,31], min: [24,23,23,23,23,22,22,22,23,24,24,24] },
    DF: { max: [28,28,29,29,27,26,26,28,31,30,29,28], min: [18,18,18,17,14,12,12,13,16,18,18,18] },
    ES: { max: [32,33,32,30,28,27,26,27,27,28,29,31], min: [23,23,23,21,19,18,17,17,18,20,21,22] },
    GO: { max: [31,31,32,32,31,30,30,33,35,33,32,31], min: [20,20,20,19,16,14,13,15,18,20,20,20] },
    MA: { max: [31,30,30,30,31,32,33,34,35,34,33,32], min: [23,23,23,23,23,22,22,22,23,23,23,23] },
    MG: { max: [30,30,30,29,27,26,26,28,30,30,29,29], min: [19,19,19,17,14,12,12,13,16,17,18,19] },
    MS: { max: [33,33,33,32,29,27,28,30,32,33,33,33], min: [23,23,22,20,17,15,14,16,19,21,22,23] },
    MT: { max: [33,33,33,33,33,33,34,36,36,35,34,33], min: [23,23,23,22,20,18,17,19,22,23,23,23] },
    PA: { max: [31,31,31,31,32,33,33,34,34,34,33,32], min: [23,23,23,23,23,22,22,22,22,22,23,23] },
    PB: { max: [31,31,30,30,29,28,27,28,29,30,31,31], min: [24,24,23,23,22,21,20,21,21,22,23,24] },
    PE: { max: [31,31,31,30,29,28,27,28,29,30,31,31], min: [24,24,24,23,22,21,20,21,21,22,23,24] },
    PI: { max: [34,33,32,33,34,35,36,37,38,37,36,35], min: [23,23,23,22,21,20,19,20,22,23,23,23] },
    PR: { max: [28,28,27,25,22,20,21,22,23,25,26,28], min: [18,18,17,14,11,9,9,10,12,14,16,17] },
    RJ: { max: [32,33,31,29,27,26,26,26,26,27,29,31], min: [24,24,23,21,19,18,17,18,19,20,22,23] },
    RN: { max: [31,31,30,30,30,29,28,29,30,31,31,31], min: [24,23,23,23,22,21,21,21,22,23,23,24] },
    RO: { max: [31,31,32,32,32,32,33,35,34,33,32,31], min: [22,22,22,22,21,19,18,19,21,22,22,22] },
    RR: { max: [33,34,34,33,31,31,32,34,35,35,34,33], min: [24,24,24,24,23,23,23,23,23,24,24,24] },
    RS: { max: [31,30,28,25,22,19,20,21,22,24,27,29], min: [20,20,19,15,12,10,10,11,13,15,17,19] },
    SC: { max: [30,30,28,26,23,21,21,22,23,25,27,29], min: [21,21,19,17,14,11,11,12,14,16,18,20] },
    SE: { max: [30,31,31,30,28,27,26,27,28,29,30,30], min: [23,23,23,23,22,21,20,20,21,22,22,23] },
    SP: { max: [28,29,28,26,24,22,22,24,25,26,27,28], min: [19,19,18,16,13,11,11,12,14,15,17,18] },
    TO: { max: [32,32,32,33,33,34,35,37,37,35,33,32], min: [22,22,22,22,20,18,17,19,21,22,22,22] },
  }

  const climRef = CLIM_REF[uf]
  const climMax = climRef ? climRef.max[mesAtual] : null
  const climMin = climRef ? climRef.min[mesAtual] : null
  const anomMax = climMax != null && tempMediaMax != null ? tempMediaMax - climMax : null
  const anomMin = climMin != null && tempMediaMin != null ? tempMediaMin - climMin : null

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CloudRain size={16} style={{ color: '#0EA5E9' }} />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'" }}>Previsão CPTEC/INPE</span>
          <span style={{ fontSize: 9, background: '#F0F9FF', color: '#0EA5E9', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>NOVO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#ccc' }}>{cidadeNome}</span>
          <button
            onClick={fetchDados}
            style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            title="Atualizar"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {tempMax != null && (
          <MetricCard icon={Thermometer} label="Temp. Máxima" value={tempMax} unit="°C"
            sublabel="Maior prevista" color="#EF4444" />
        )}
        {tempMin != null && (
          <MetricCard icon={Thermometer} label="Temp. Mínima" value={tempMin} unit="°C"
            sublabel="Menor prevista" color="#3B82F6" />
        )}
        {climMax != null && (
          <MetricCard icon={BarChart3} label="Climatologia Máx" value={climMax} unit="°C"
            sublabel={`Média histórica (${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][mesAtual]})`}
            color="#8B5CF6" />
        )}
        {climMin != null && (
          <MetricCard icon={BarChart3} label="Climatologia Mín" value={climMin} unit="°C"
            sublabel={`Média histórica (${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][mesAtual]})`}
            color="#6366F1" />
        )}
      </div>

      {/* Anomalies */}
      {(anomMax != null || anomMin != null) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {anomMax != null && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: anomMax > 0 ? '#FEF2F2' : anomMax < 0 ? '#EFF6FF' : '#F5F5F5',
              border: `1px solid ${anomMax > 0 ? '#FECACA' : anomMax < 0 ? '#BFDBFE' : '#E5E5E5'}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {anomMax > 0 ? <TrendingUp size={14} style={{ color: '#EF4444' }} /> : <TrendingDown size={14} style={{ color: '#3B82F6' }} />}
              <div>
                <span style={{ fontSize: 10, color: '#888', display: 'block' }}>Anomalia Temp. Máxima</span>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'DM Sans'", color: anomMax > 0 ? '#DC2626' : '#2563EB' }}>
                  {anomMax > 0 ? '+' : ''}{anomMax}°C
                </span>
              </div>
            </div>
          )}
          {anomMin != null && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: anomMin > 0 ? '#FEF2F2' : anomMin < 0 ? '#EFF6FF' : '#F5F5F5',
              border: `1px solid ${anomMin > 0 ? '#FECACA' : anomMin < 0 ? '#BFDBFE' : '#E5E5E5'}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {anomMin > 0 ? <TrendingUp size={14} style={{ color: '#EF4444' }} /> : <TrendingDown size={14} style={{ color: '#3B82F6' }} />}
              <div>
                <span style={{ fontSize: 10, color: '#888', display: 'block' }}>Anomalia Temp. Mínima</span>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'DM Sans'", color: anomMin > 0 ? '#DC2626' : '#2563EB' }}>
                  {anomMin > 0 ? '+' : ''}{anomMin}°C
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Daily Forecast */}
      {dias.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Previsão diária — {cidadeNome}
            </span>
            {dias.length > 3 && (
              <button
                onClick={() => setExpandido(!expandido)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                {expandido ? 'Recolher' : `Ver todos (${dias.length})`}
                {expandido ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(expandido ? dias : dias.slice(0, 3)).map((dia, i) => (
              <ForecastDay key={i} dia={dia} />
            ))}
          </div>
        </>
      )}

      <p style={{ fontSize: 9, color: '#ccc', marginTop: 10 }}>
        Fonte: CPTEC/INPE via BrasilAPI · Climatologia: médias históricas INMET · Atualizado: {lastUpdate?.toLocaleTimeString('pt-BR') || '—'}
      </p>
    </div>
  )
}
