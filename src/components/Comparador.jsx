import { useState, useMemo } from 'react'
import { X, Plus, Search, ArrowRight } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'
import { getCorScore, getLabelScore } from '../utils/scoring'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'

const CORES_COMPARADOR = ['#0EA5E9', '#F59E0B', '#A855F7']

function SelectorSlot({ index, ente, onRemove, onAdd, todos, selecionados }) {
  const [buscando, setBuscando] = useState(false)
  const [busca, setBusca] = useState('')

  const filtrados = useMemo(() => {
    if (!busca.trim()) return todos.filter(e => !selecionados.includes(e))
    const q = busca.toLowerCase()
    return todos.filter(e => !selecionados.includes(e) && (e.nome.toLowerCase().includes(q) || e.uf.toLowerCase().includes(q)))
  }, [busca, todos, selecionados])

  if (!ente) {
    if (buscando) {
      return (
        <div className="card rounded-xl  p-4 min-w-0">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999]" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-[#f0f0ee] border border-[#ddd] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            />
            <button onClick={() => setBuscando(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#1a1a1a]">
              <X size={14} />
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
            {filtrados.slice(0, 15).map(e => (
              <button
                key={e.uf + e.nome}
                onClick={() => { onAdd(e); setBuscando(false); setBusca('') }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#f0f0ee] flex justify-between items-center"
              >
                <span className="text-slate-200">{e.nome} ({e.uf})</span>
                <span className="text-[#999] font-medium">{e.scores.farol}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <button
        onClick={() => setBuscando(true)}
        className="card rounded-xl border border-dashed border-[#ddd] p-8 flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-colors min-h-[120px]"
      >
        <Plus size={20} className="text-[#999]" />
        <span className="text-xs text-[#999]">Adicionar</span>
      </button>
    )
  }

  const cor = CORES_COMPARADOR[index]
  return (
    <div className="card rounded-xl  p-4 relative" style={{ borderTopColor: cor, borderTopWidth: '2px' }}>
      <button onClick={onRemove} className="absolute top-2 right-2 text-[#999] hover:text-[#1a1a1a] p-1">
        <X size={14} />
      </button>
      <p className="font-semibold text-sm text-[#1a1a1a]">{ente.nome}</p>
      <p className="text-[10px] text-[#999] mb-3">{ente.uf} · {ente.tipo === 'capital' ? 'Capital' : 'Estado'}</p>
      <div className="text-3xl font-bold" style={{ color: getCorScore(ente.scores.farol) }}>
        {ente.scores.farol}
      </div>
      <span className="text-[10px]" style={{ color: getCorScore(ente.scores.farol) }}>
        {getLabelScore(ente.scores.farol)}
      </span>
    </div>
  )
}

export default function Comparador({ todos, isOpen, onClose, enteInicial }) {
  const [selecionados, setSelecionados] = useState(enteInicial ? [enteInicial] : [])

  function addEnte(ente) {
    if (selecionados.length < 3 && !selecionados.find(e => e.uf === ente.uf && e.nome === ente.nome)) {
      setSelecionados([...selecionados, ente])
    }
  }

  function removeEnte(index) {
    setSelecionados(selecionados.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  // Radar data
  const radarData = [
    { subject: 'Governança', ...Object.fromEntries(selecionados.map((e, i) => [`v${i}`, e.scores.governanca])) },
    { subject: 'Políticas', ...Object.fromEntries(selecionados.map((e, i) => [`v${i}`, e.scores.politicas])) },
    { subject: 'Finanças', ...Object.fromEntries(selecionados.map((e, i) => [`v${i}`, e.scores.financas])) },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FAFAF8] border border-[#ddd] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#FAFAF8] border-b border-[#e8e8e4] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-base">Comparar estados e capitais</h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#1a1a1a] p-1"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Slots */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[0, 1, 2].map(i => (
              <SelectorSlot
                key={i}
                index={i}
                ente={selecionados[i] || null}
                onRemove={() => removeEnte(i)}
                onAdd={addEnte}
                todos={todos}
                selecionados={selecionados}
              />
            ))}
          </div>

          {selecionados.length >= 2 && (
            <>
              {/* Radar overlay */}
              <div className="card rounded-xl  p-5">
                <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider mb-4">Perfil comparativo</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    {selecionados.map((ente, i) => (
                      <Radar
                        key={ente.uf}
                        name={ente.nome}
                        dataKey={`v${i}`}
                        stroke={CORES_COMPARADOR[i]}
                        fill={CORES_COMPARADOR[i]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <Legend
                      formatter={(value) => <span className="text-xs text-[#555]">{value}</span>}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela de indicadores */}
              <div className="card rounded-xl  overflow-hidden">
                <div className="px-5 py-3 border-b border-[#e8e8e4]">
                  <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider">Indicadores por componente</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#e8e8e4]">
                        <th className="px-4 py-2.5 text-left text-[#999] font-medium">Componente</th>
                        {selecionados.map((e, i) => (
                          <th key={e.uf} className="px-4 py-2.5 text-center font-medium" style={{ color: CORES_COMPARADOR[i] }}>
                            {e.nome}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(PILARES).map(([pilarKey, pilar]) => (
                        <>
                          <tr key={pilarKey + '-header'} className="bg-[#FAFAF8]">
                            <td colSpan={selecionados.length + 1} className="px-4 py-2 font-semibold text-[#555]">
                              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pilar.cor }} />
                              {pilar.label}
                            </td>
                          </tr>
                          {Object.entries(pilar.componentes).map(([compId, comp]) => (
                            <tr key={compId} className="border-t border-white/[0.03] hover:bg-[#FAFAF8]">
                              <td className="px-4 py-2 text-[#888] pl-8">{compId} · {comp.label}</td>
                              {selecionados.map((ente) => {
                                const vals = comp.itens.map(item => ente.indicadores[`${compId}.${item}`]?.valor ?? 0)
                                const media = vals.reduce((a, b) => a + b, 0) / vals.length
                                const escala = getEscala(media)
                                const pct = Math.round(media * 100)
                                return (
                                  <td key={ente.uf + compId} className="px-4 py-2 text-center">
                                    <span className="inline-flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: escala.cor }} />
                                      <span style={{ color: escala.cor }}>{pct}%</span>
                                    </span>
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {selecionados.length < 2 && (
            <p className="text-center text-sm text-[#999] py-8">
              Selecione pelo menos 2 entes para comparar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
