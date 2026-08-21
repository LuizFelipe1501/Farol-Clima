import { useState, useEffect } from 'react'
import { Users, Flame, Shield } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sublabel, accent }) {
  return (
    <div className="card" style={{ padding: 16, transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Icon size={14} style={{ color: accent }} />
        <span style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{label}</span>
      </div>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{value}</p>
      {sublabel && <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{sublabel}</p>}
    </div>
  )
}

export default function DadosComplementares({ uf }) {
  const [data, setData] = useState(null)
  useEffect(() => { fetch('/data/complementar.json').then(r => r.json()).then(d => setData(d[uf] || null)) }, [uf])
  if (!data) return null

  const fmt = n => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(0)+'k' : n.toLocaleString('pt-BR')
  const variacao = data.focos_calor_2025 > 0 ? Math.round(((data.focos_calor_2026 - data.focos_calor_2025) / data.focos_calor_2025) * 100) : 0

  return (
    <div>
      <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 10 }}>Indicadores de risco · {uf}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <StatCard icon={Users} label="População" value={fmt(data.populacao)} sublabel="IBGE 2025" accent="#0EA5E9" />
        <StatCard icon={Flame} label="Focos 2026" value={fmt(data.focos_calor_2026)} sublabel={`${variacao >= 0 ? '+' : ''}${variacao}% vs 2025`} accent="#F59E0B" />
        <StatCard icon={Shield} label="CEMADEN" value={data.municipios_monitorados_cemaden} sublabel="Municípios monitorados" accent="#0F766E" />
      </div>
      <p style={{ fontSize: 9, color: '#ccc', marginTop: 6 }}>Fontes: IBGE · INPE Queimadas (até 14/ago/2026) · CEMADEN</p>
    </div>
  )
}
