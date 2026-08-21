import { useState } from 'react'
import { FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'

export default function ComentariosAuditoria({ ente }) {
  const [pilarAberto, setPilarAberto] = useState(null)
  const [compAberto, setCompAberto] = useState(null)

  const { indicadores, comentarios } = ente

  function togglePilar(key) {
    setPilarAberto(pilarAberto === key ? null : key)
    setCompAberto(null)
  }

  function toggleComp(key) {
    setCompAberto(compAberto === key ? null : key)
  }

  return (
    <div className="card rounded-2xl  p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={18} className="text-blue-400" />
        <h3 className="font-semibold text-sm">Evidências e Justificativas da Auditoria</h3>
      </div>
      <p className="text-xs text-[#999] mb-5">
        Comentários dos auditores do Tribunal de Contas para cada indicador avaliado. Clique para expandir.
      </p>

      <div className="space-y-2">
        {Object.entries(PILARES).map(([pilarKey, pilar]) => (
          <div key={pilarKey} className="rounded-xl  overflow-hidden">
            {/* Pilar header */}
            <button
              onClick={() => togglePilar(pilarKey)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f5f5f3] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pilar.cor }} />
                <span className="text-sm font-medium">{pilar.label}</span>
                <span className="text-xs text-[#999]">
                  ({Object.keys(pilar.componentes).length} componentes)
                </span>
              </span>
              {pilarAberto === pilarKey ? <ChevronDown size={16} className="text-[#888]" /> : <ChevronRight size={16} className="text-[#888]" />}
            </button>

            {/* Componentes */}
            {pilarAberto === pilarKey && (
              <div className="border-t border-[#e8e8e4]">
                {Object.entries(pilar.componentes).map(([compId, comp]) => {
                  const vals = comp.itens.map(item => {
                    const key = `${compId}.${item}`
                    return indicadores[key]?.valor ?? 0
                  })
                  const media = vals.reduce((a, b) => a + b, 0) / vals.length
                  const escala = getEscala(media)

                  return (
                    <div key={compId} className="border-t border-[#eee]">
                      <button
                        onClick={() => toggleComp(compId)}
                        className="w-full flex items-center justify-between px-6 py-2.5 hover:bg-[#FAFAF8] transition-colors"
                      >
                        <span className="text-sm text-[#555]">{compId} · {comp.label}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: escala.cor + '22', color: escala.cor }}>
                            {escala.label}
                          </span>
                          {compAberto === compId ? <ChevronDown size={14} className="text-[#999]" /> : <ChevronRight size={14} className="text-[#999]" />}
                        </span>
                      </button>

                      {/* Sub-itens com comentários */}
                      {compAberto === compId && (
                        <div className="bg-[#FAFAF8]/50 px-6 py-3 space-y-3">
                          {comp.itens.map(item => {
                            const key = `${compId}.${item}`
                            const ind = indicadores[key]
                            const comment = comentarios[key]
                            const valor = ind?.valor ?? 0
                            const escItem = getEscala(valor)

                            return (
                              <div key={key} className="border-l-2 pl-3 py-1" style={{ borderColor: escItem.cor }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-[#888]">{key}</span>
                                  <span className="text-[10px] font-medium" style={{ color: escItem.cor }}>
                                    {escItem.label}
                                  </span>
                                </div>
                                {comment ? (
                                  <p className="text-xs text-[#888] leading-relaxed">
                                    {comment.length > 400 ? comment.slice(0, 400) + '...' : comment}
                                  </p>
                                ) : (
                                  <p className="text-xs text-[#ccc] italic">Sem comentário registrado.</p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
