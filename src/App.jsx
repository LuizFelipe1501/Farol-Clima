import { useState } from 'react'
import { useClimaData } from './hooks/useClimaData'
import Landing from './components/Landing'
import Logo from './components/Logo'
import MapaBrasil from './components/MapaBrasil'
import Dashboard from './components/Dashboard'
import Ranking from './components/Ranking'
import Comparador from './components/Comparador'
import { Map, BarChart3, Home, ChevronRight, GitCompareArrows } from 'lucide-react'

export default function App() {
  const { estados, capitais, todos, loading } = useClimaData()
  const [page, setPage] = useState('landing')
  const [tab, setTab] = useState('mapa')
  const [ente, setEnte] = useState(null)
  const [tipo, setTipo] = useState('estados')
  const [compOpen, setCompOpen] = useState(false)
  const [compEnte, setCompEnte] = useState(null)

  const dados = tipo === 'estados' ? estados : capitais

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
      <div style={{ textAlign: 'center' }}>
        <Logo size={48} />
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Carregando dados...</p>
      </div>
    </div>
  )

  if (page === 'landing') return <Landing onEntrar={() => setPage('app')} totalEstados={estados.length} totalCapitais={capitais.length} />

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,248,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
              <Logo size={24} />
              <span style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 14, color: '#0F766E' }}>FAROL CLIMA</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#999' }}>
              <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 11 }}>Início</button>
              <ChevronRight size={10} />
              <button onClick={() => { setEnte(null); setTab('mapa') }} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 11 }}>{tipo === 'estados' ? 'Estados' : 'Capitais'}</button>
              {ente && <><ChevronRight size={10} /><span style={{ color: '#555' }}>{ente.nome}</span></>}
            </div>
          </div>

          {/* Center */}
          <div style={{ display: 'flex', gap: 2, background: '#f0f0ee', borderRadius: 8, padding: 2 }}>
            {['estados', 'capitais'].map(t => (
              <button key={t} onClick={() => { setTipo(t); setEnte(null); setTab('mapa') }} style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: tipo === t ? 'white' : 'transparent',
                color: tipo === t ? '#0F766E' : '#888',
                boxShadow: tipo === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}>
                {t === 'estados' ? 'Estados' : 'Capitais'}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { id: 'mapa', label: 'Mapa', icon: Map },
              { id: 'ranking', label: 'Ranking', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setTab(id); setEnte(null) }} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                background: tab === id && !ente ? '#F0FDFA' : 'transparent',
                color: tab === id && !ente ? '#0F766E' : '#888',
              }}>
                <Icon size={14} />{label}
              </button>
            ))}
            <button onClick={() => { setCompEnte(null); setCompOpen(true) }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', color: '#888', background: 'transparent' }}>
              <GitCompareArrows size={14} />Comparar
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 20px 40px' }}>
        {tab === 'mapa' && !ente && <MapaBrasil dados={dados} onSelect={e => { setEnte(e); setTab('dashboard') }} tipo={tipo} />}
        {tab === 'ranking' && !ente && <Ranking dados={dados} onSelect={e => { setEnte(e); setTab('dashboard') }} />}
        {tab === 'dashboard' && ente && <Dashboard ente={ente} todos={todos} onVoltar={() => { setEnte(null); setTab('mapa') }} onComparar={e => { setCompEnte(e); setCompOpen(true) }} />}
      </main>

      <footer style={{ borderTop: '1px solid #e8e8e4', padding: '10px 24px', textAlign: 'center', fontSize: 11, color: '#ccc' }}>
        Farol Clima · ClimatonBrasil 2026 · Dados: Painel ClimaBrasil (TCU) · CPTEC/INPE · INMET
      </footer>

      <Comparador todos={todos} isOpen={compOpen} onClose={() => setCompOpen(false)} enteInicial={compEnte} />
    </div>
  )
}
