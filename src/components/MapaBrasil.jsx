import { useState, useEffect, useMemo } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { scoreToColor } from '../utils/colors'
import { getCorScore, getLabelScore } from '../utils/scoring'

export default function MapaBrasil({ dados, onSelect, tipo }) {
  const [geojson, setGeojson] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [zoomLevel, setZoomLevel] = useState(1.0)

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
      .center([-53.8, -14.8])
      .scale(840)
      .translate([450, 335])

    return {
      pathGenerator: geoPath().projection(projection),
      features: geojson.features,
    }
  }, [geojson])

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2.5, prev + 0.35))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(1.0, prev - 0.35))
  const handleResetZoom = () => setZoomLevel(1.0)

  // Dynamic SVG viewBox based on zoomLevel
  const viewBoxStr = useMemo(() => {
    const w = 900 / zoomLevel
    const h = 700 / zoomLevel
    const x = 450 - w / 2
    const y = 350 - h / 2
    return `${x} ${y} ${w} ${h}`
  }, [zoomLevel])

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
      {/* Mapa Container */}
      <div className="relative card rounded-2xl overflow-hidden flex flex-col justify-between">
        
        {/* Visualizador SVG + Controls */}
        <div className="relative w-full overflow-hidden bg-slate-50/40 min-h-[360px] sm:min-h-[460px] md:min-h-[520px] flex items-center justify-center">
          
          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 shadow-sm">
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              title="Aumentar Zoom"
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1.0}
              title="Diminuir Zoom"
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer"
            >
              <ZoomOut size={16} />
            </button>
            {zoomLevel > 1.0 && (
              <button
                onClick={handleResetZoom}
                title="Redefinir Zoom"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-teal-600 transition-colors cursor-pointer"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          {/* Banner do Estado Selecionado/Hover (Mobile Friendly) */}
          {hoveredEnte && (
            <div className="absolute top-3 left-3 z-20 md:hidden bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-xl px-3.5 py-2 flex items-center gap-2.5">
              <span className="font-bold text-xs text-slate-800">{hoveredEnte.nome} ({hoveredEnte.uf})</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ color: getCorScore(hoveredEnte.scores.farol), backgroundColor: getCorScore(hoveredEnte.scores.farol) + '18' }}>
                {hoveredEnte.scores.farol} · {getLabelScore(hoveredEnte.scores.farol)}
              </span>
            </div>
          )}

          {/* SVG Map */}
          <svg
            viewBox={viewBoxStr}
            className="w-full h-auto max-h-[60vh] md:max-h-none transition-all duration-300 ease-out select-none"
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
                  stroke={isHovered ? '#0F766E' : 'rgba(0,0,0,0.15)'}
                  strokeWidth={isHovered ? 2.5 : 0.6}
                  opacity={hovered && !isHovered ? 0.45 : 1}
                  className="cursor-pointer transition-all duration-150"
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
              return (
                <text
                  key={sigla + '-label'}
                  x={centroid[0]}
                  y={centroid[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-slate-900 text-[10px] md:text-[9px] font-extrabold pointer-events-none select-none"
                  style={{
                    paintOrder: 'stroke fill',
                    stroke: '#ffffff',
                    strokeWidth: '2.5px',
                    strokeLinejoin: 'round',
                  }}
                >
                  {sigla}
                </text>
              )
            })}
          </svg>

          {/* Desktop Tooltip */}
          {hoveredEnte && (
            <div
              className="hidden md:block absolute pointer-events-none z-50 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xl px-4 py-3 min-w-[200px]"
              style={{
                left: `${Math.min(80, Math.max(10, (mousePos.x / 900) * 100))}%`,
                top: `${Math.min(80, Math.max(10, (mousePos.y / 700) * 100))}%`,
                transform: 'translate(12px, -50%)',
              }}
            >
              <p className="font-semibold text-[#1a1a1a]">{hoveredEnte.nome}</p>
              <p className="text-[11px] text-[#888] mb-2">{hoveredEnte.uf} · {hoveredEnte.tipo === 'capital' ? 'Capital' : 'Estado'}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold" style={{ color: getCorScore(hoveredEnte.scores.farol) }}>
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
              <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-2 border-t border-slate-100">
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
        </div>

        {/* Legenda (Responsiva: abaixo do mapa no mobile, overlay no desktop) */}
        <div className="p-3.5 bg-white border-t border-slate-100 md:absolute md:bottom-4 md:left-4 md:border md:border-slate-200/80 md:bg-white/95 md:backdrop-blur-md md:rounded-xl md:shadow-md md:p-3 z-10">
          <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Índice Farol</p>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[9px] text-[#999]">0</span>
            <div className="w-full md:w-36 h-2.5 rounded-full" style={{
              background: 'linear-gradient(to right, #991B1B, #DC2626, #EA580C, #D97706, #65A30D, #059669, #0D9488)'
            }} />
            <span className="text-[9px] text-[#999]">100</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-2 gap-x-3 gap-y-1">
            {[
              { label: '0-34 Crítico', cor: '#DC2626' },
              { label: '35-49 Baixo', cor: '#EA580C' },
              { label: '50-64 Médio', cor: '#D97706' },
              { label: '65-79 Bom', cor: '#65A30D' },
              { label: '80-100 Avançado', cor: '#059669' },
            ].map(i => (
              <div key={i.label} className="flex items-center gap-1.5 text-[9px] text-slate-600 font-medium whitespace-nowrap">
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
        <div className="card rounded-2xl p-5">
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
                <button onClick={() => onSelect(bestEnte)} className="text-emerald-400 hover:underline font-medium cursor-pointer">
                  {bestEnte.nome} ({bestEnte.scores.farol})
                </button>
              </div>
            )}
            {worstEnte && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#888]">Pior</span>
                <button onClick={() => onSelect(worstEnte)} className="text-red-400 hover:underline font-medium cursor-pointer">
                  {worstEnte.nome} ({worstEnte.scores.farol})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick list */}
        <div className="card rounded-2xl p-5">
          <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider mb-3">Todos os entes</h3>
          <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {dados.map((ente, i) => (
              <button
                key={ente.uf + ente.nome}
                onClick={() => onSelect(ente)}
                onMouseEnter={() => setHovered(ente.uf)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
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
