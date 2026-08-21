import { useState, useEffect, useMemo, useCallback } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { scoreToColor } from '../utils/colors'
import { getCorScore, getLabelScore } from '../utils/scoring'

export default function MapaBrasil({ dados, onSelect, tipo }) {
  const [geojson, setGeojson] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetch('/data/brazil-states.geojson')
      .then(r => r.json())
      .then(setGeojson)
  }, [])

  const enteMap = useMemo(() => {
    const m = {}
    dados.forEach(e => { m[e.uf] = e })
    return m
  }, [dados])

  const { pathGenerator, features } = useMemo(() => {
    if (!geojson) return { pathGenerator: null, features: [] }

    const projection = geoMercator()
      .center([-54, -15])
      .scale(750)
      .translate([450, 340])

    return {
      pathGenerator: geoPath().projection(projection),
      features: geojson.features,
    }
  }, [geojson])

  const hoveredEnte = hovered ? enteMap[hovered] : null

  // Stats resumo
  const avgScore = useMemo(() => {
    if (!dados.length) return 0
    return Math.round(dados.reduce((a, e) => a + e.scores.farol, 0) / dados.length)
  }, [dados])

  const bestEnte = dados[0]
  const worstEnte = dados[dados.length - 1]

  if (!pathGenerator) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 md:gap-6">
      {/* Mapa */}
      <div className="relative card rounded-2xl  overflow-hidden">
        <svg
          viewBox="0 0 900 700"
          className="w-full"
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width) * 900,
              y: ((e.clientY - rect.top) / rect.height) * 700,
            })
          }}
        >
          {features.map(feat => {
            const sigla = feat.properties.sigla
            const ente = enteMap[sigla]
            const score = ente?.scores?.farol ?? -1
            const fill = score >= 0 ? scoreToColor(score) : '#e8e8e4'
            const isHovered = hovered === sigla

            return (
              <path
                key={sigla}
                d={pathGenerator(feat)}
                fill={fill}
                stroke={isHovered ? '#fff' : 'rgba(0,0,0,0.08)'}
                strokeWidth={isHovered ? 2 : 0.5}
                opacity={hovered && !isHovered ? 0.4 : 1}
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => ente && onSelect(ente)}
                onMouseEnter={() => setHovered(sigla)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}

          {/* Labels */}
          {features.map(feat => {
            const sigla = feat.properties.sigla
            const centroid = pathGenerator.centroid(feat)
            if (!centroid || isNaN(centroid[0])) return null
            const ente = enteMap[sigla]
            return (
              <text
                key={sigla + '-label'}
                x={centroid[0]}
                y={centroid[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[#1a1a1a] text-[9px] font-bold pointer-events-none select-none"
                style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}
              >
                {sigla}
              </text>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredEnte && (
          <div
            className="absolute pointer-events-none z-50 bg-[#f5f5f3] border border-white/10 rounded-xl shadow-2xl px-5 py-4 min-w-[220px]"
            style={{
              left: `${(mousePos.x / 900) * 100}%`,
              top: `${(mousePos.y / 700) * 100}%`,
              transform: 'translate(12px, -50%)',
            }}
          >
            <p className="font-semibold text-[#1a1a1a]">{hoveredEnte.nome}</p>
            <p className="text-[11px] text-[#888] mb-3">{hoveredEnte.uf} · {hoveredEnte.tipo === 'capital' ? 'Capital' : 'Estado'}</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold" style={{ color: getCorScore(hoveredEnte.scores.farol) }}>
                {hoveredEnte.scores.farol}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: getCorScore(hoveredEnte.scores.farol) + '22',
                  color: getCorScore(hoveredEnte.scores.farol),
                }}
              >
                {getLabelScore(hoveredEnte.scores.farol)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-[11px] text-center">
              {[
                { label: 'Gov.', val: hoveredEnte.scores.governanca },
                { label: 'Pol.', val: hoveredEnte.scores.politicas },
                { label: 'Fin.', val: hoveredEnte.scores.financas },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[#999]">{s.label}</p>
                  <p className="font-semibold text-[#1a1a1a]">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legenda */}
        <div className="absolute bottom-4 left-4 card/95 backdrop-blur-sm rounded-xl  px-4 py-3">
          <p className="text-[10px] font-medium text-[#888] mb-2.5 uppercase tracking-wider">Índice Farol</p>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[9px] text-[#999]">0</span>
            <div className="w-36 h-2.5 rounded-full" style={{
              background: 'linear-gradient(to right, #991B1B, #DC2626, #EA580C, #D97706, #65A30D, #059669, #0D9488)'
            }} />
            <span className="text-[9px] text-[#999]">100</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { label: '0-34 Crítico', cor: '#DC2626' },
              { label: '35-49 Baixo', cor: '#EA580C' },
              { label: '50-64 Médio', cor: '#D97706' },
              { label: '65-79 Bom', cor: '#65A30D' },
              { label: '80-100 Avançado', cor: '#059669' },
            ].map(i => (
              <div key={i.label} className="flex items-center gap-1.5 text-[9px] text-[#999]">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: i.cor }} />
                {i.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Summary stats */}
        <div className="card rounded-2xl  p-5">
          <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider mb-4">
            Resumo · {tipo === 'estados' ? 'Estados' : 'Capitais'}
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-[#999] mb-1">Média nacional</p>
              <p className="text-3xl font-bold" style={{ color: getCorScore(avgScore) }}>{avgScore}</p>
            </div>
            {bestEnte && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#888]">Melhor</span>
                <button onClick={() => onSelect(bestEnte)} className="text-emerald-400 hover:underline font-medium">
                  {bestEnte.nome} ({bestEnte.scores.farol})
                </button>
              </div>
            )}
            {worstEnte && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#888]">Pior</span>
                <button onClick={() => onSelect(worstEnte)} className="text-red-400 hover:underline font-medium">
                  {worstEnte.nome} ({worstEnte.scores.farol})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick list */}
        <div className="card rounded-2xl  p-5">
          <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider mb-3">Todos os entes</h3>
          <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {dados.map((ente, i) => (
              <button
                key={ente.uf + ente.nome}
                onClick={() => onSelect(ente)}
                onMouseEnter={() => setHovered(ente.uf)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  hovered === ente.uf ? 'bg-[#f0f0ee]' : 'hover:bg-[#f5f5f3]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#999] text-xs w-5">{i + 1}.</span>
                  <span className="text-[#333]">{ente.nome}</span>
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    color: getCorScore(ente.scores.farol),
                    backgroundColor: getCorScore(ente.scores.farol) + '15',
                  }}
                >
                  {ente.scores.farol}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
