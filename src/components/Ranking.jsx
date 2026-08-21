import { useState, useMemo } from 'react'
import { ArrowUpDown, Search } from 'lucide-react'
import { getCorScore, getLabelScore } from '../utils/scoring'
import { REGIOES, UF_REGIAO } from '../data/constants'

function ScoreBadge({ score }) {
  const cor = getCorScore(score)
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cor + '22', color: cor }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cor }} />
      {score}
    </span>
  )
}

export default function Ranking({ dados, onSelect }) {
  const [sortKey, setSortKey] = useState('farol')
  const [sortAsc, setSortAsc] = useState(false)
  const [filtroRegiao, setFiltroRegiao] = useState('todas')
  const [busca, setBusca] = useState('')

  const dadosFiltrados = useMemo(() => {
    let result = [...dados]
    if (filtroRegiao !== 'todas') {
      result = result.filter(e => UF_REGIAO[e.uf] === filtroRegiao || e.regiao === filtroRegiao)
    }
    if (busca.trim()) {
      const q = busca.toLowerCase()
      result = result.filter(e => e.nome.toLowerCase().includes(q) || e.uf.toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      const va = a.scores[sortKey] ?? 0
      const vb = b.scores[sortKey] ?? 0
      return sortAsc ? va - vb : vb - va
    })
    return result
  }, [dados, sortKey, sortAsc, filtroRegiao, busca])

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const colunas = [
    { key: 'farol', label: 'Score Farol' },
    { key: 'governanca', label: 'Governança' },
    { key: 'politicas', label: 'Políticas' },
    { key: 'financas', label: 'Finanças' },
  ]

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-2 md:gap-3 mb-4 md:mb-6 flex-col sm:flex-row">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[slate-400]" />
          <input
            type="text"
            placeholder="Buscar estado ou capital..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[white/5] border border-[white/10] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[sky-500]"
          />
        </div>
        <select
          value={filtroRegiao}
          onChange={e => setFiltroRegiao(e.target.value)}
          className="px-3 py-2 bg-[white/5] border border-[white/10] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[sky-500]"
        >
          <option value="todas">Todas as regiões</option>
          {Object.entries(REGIOES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="card rounded-xl  overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-[white/10]">
              <th className="px-4 py-3 text-left text-[slate-400] font-medium w-12">#</th>
              <th className="px-4 py-3 text-left text-[slate-400] font-medium">Nome</th>
              <th className="px-4 py-3 text-left text-[slate-400] font-medium w-16">UF</th>
              {colunas.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-[slate-400] font-medium cursor-pointer hover:text-[#1a1a1a] transition-colors"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={14} className={sortKey === col.key ? 'text-[sky-500]' : ''} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((ente, i) => (
              <tr
                key={ente.uf + ente.nome}
                onClick={() => onSelect(ente)}
                className="border-b border-[white/10]/50 hover:bg-[white/5] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-[slate-400]">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{ente.nome}</td>
                <td className="px-4 py-3 text-[slate-400]">{ente.uf}</td>
                {colunas.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <ScoreBadge score={ente.scores[col.key]} />
                  </td>
                ))}
              </tr>
            ))}
            {dadosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[slate-400]">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
