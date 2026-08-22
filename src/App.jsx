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
        <Logo size={80} />
        <p style={{ color: '#999', fontSize: 13, marginTop: 12 }}>Carregando dados...</p>
      </div>
    </div>
  )

  if (page === 'landing') return <Landing onEntrar={() => setPage('app')} totalEstados={estados.length} totalCapitais={capitais.length} />

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {/* Logo + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Logo size={34} />
              <span style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 14, color: '#0F766E', display: 'none' }} className="sm-show">FAROL CLIMA</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#999', overflow: 'hidden' }}>
              <ChevronRight size={10} style={{ flexShrink: 0 }} />
              <button onClick={() => { setEnte(null); setTab('mapa') }} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}>{tipo === 'estados' ? 'Estados' : 'Capitais'}</button>
              {ente && <><ChevronRight size={10} style={{ flexShrink: 0 }} /><span style={{ color: '#333', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{ente.nome}</span></>}
            </div>
          </div>

          {/* Toggle + nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 1, background: '#f0f0ee', borderRadius: 8, padding: 2 }}>
              {['estados', 'capitais'].map(t => (
                <button key={t} onClick={() => { setTipo(t); setEnte(null); setTab('mapa') }} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: tipo === t ? 'white' : 'transparent',
                  color: tipo === t ? '#0F766E' : '#999',
                  boxShadow: tipo === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}>
                  {t === 'estados' ? 'Estados' : 'Capitais'}
                </button>
              ))}
            </div>

            {[
              { id: 'mapa', label: 'Mapa', icon: Map },
              { id: 'ranking', label: 'Ranking', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setTab(id); setEnte(null) }} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: tab === id && !ente ? '#F0FDFA' : 'transparent',
                color: tab === id && !ente ? '#0F766E' : '#999',
              }}>
                <Icon size={13} /><span className="sm-show" style={{ display: 'none' }}>{label}</span>
              </button>
            ))}
            <button onClick={() => { setCompEnte(null); setCompOpen(true) }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', color: '#999' }}>
              <GitCompareArrows size={13} /><span className="sm-show" style={{ display: 'none' }}>Comparar</span>
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
