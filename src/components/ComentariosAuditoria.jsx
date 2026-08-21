import { useState } from 'react'
import { FileText, ChevronDown, ChevronRight, X, Maximize2 } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'

function EvidenciaModal({ isOpen, onClose, comentario, indicadorKey, escala }) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 16, maxWidth: 700, width: '100%',
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #e8e8e4',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={16} style={{ color: '#3B82F6' }} />
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans'" }}>
                Evidência — {indicadorKey}
              </span>
              {escala && (
                <span style={{
                  marginLeft: 8, fontSize: 10, fontWeight: 600,
                  padding: '2px 8px', borderRadius: 10,
                  background: escala.cor + '22', color: escala.cor,
                }}>
                  {escala.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f3', border: 'none', borderRadius: 8,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#888',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{
          padding: 24, overflowY: 'auto', flex: 1,
        }} className="custom-scrollbar">
          <p style={{
            fontSize: 10, color: '#999', textTransform: 'uppercase',
            letterSpacing: '0.1em', fontWeight: 600, marginBottom: 12,
          }}>
            Comentário do auditor do Tribunal de Contas
          </p>
          <p style={{
            fontSize: 14, color: '#444', lineHeight: 1.75,
            whiteSpace: 'pre-wrap',
          }}>
            {comentario}
          </p>
        </div>

        {/* Modal footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid #e8e8e4',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, color: '#ccc' }}>
            Fonte: Painel ClimaBrasil · Auditoria TCU
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 12,
              fontWeight: 600, background: '#f0f0ee', border: 'none',
              cursor: 'pointer', color: '#555',
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ComentariosAuditoria({ ente }) {
  const [pilarAberto, setPilarAberto] = useState(null)
  const [compAberto, setCompAberto] = useState(null)
  const [modalData, setModalData] = useState(null)

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
        Comentários dos auditores do Tribunal de Contas para cada indicador avaliado. Clique para expandir e use o botão para visualizar a evidência completa.
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
                            const isLong = comment && comment.length > 300

                            return (
                              <div key={key} className="border-l-2 pl-3 py-1" style={{ borderColor: escItem.cor }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-[#888]">{key}</span>
                                  <span className="text-[10px] font-medium" style={{ color: escItem.cor }}>
                                    {escItem.label}
                                  </span>
                                  {comment && (
                                    <button
                                      onClick={() => setModalData({ key, comment, escala: escItem })}
                                      title="Ver evidência completa"
                                      style={{
                                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                                        padding: '2px 8px', borderRadius: 6, fontSize: 10,
                                        background: '#F0F9FF', color: '#0EA5E9', border: 'none',
                                        cursor: 'pointer', fontWeight: 500,
                                      }}
                                    >
                                      <Maximize2 size={10} />
                                      Ver completo
                                    </button>
                                  )}
                                </div>
                                {comment ? (
                                  <div>
                                    <p className="text-xs text-[#888] leading-relaxed">
                                      {isLong ? comment.slice(0, 300) + '...' : comment}
                                    </p>
                                    {isLong && (
                                      <button
                                        onClick={() => setModalData({ key, comment, escala: escItem })}
                                        style={{
                                          marginTop: 6, fontSize: 11, color: '#0EA5E9',
                                          background: 'none', border: 'none', cursor: 'pointer',
                                          fontWeight: 500, textDecoration: 'underline',
                                          textDecorationStyle: 'dotted',
                                        }}
                                      >
                                        Ler evidência completa →
                                      </button>
                                    )}
                                  </div>
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

      {/* Modal de evidência completa */}
      <EvidenciaModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        comentario={modalData?.comment || ''}
        indicadorKey={modalData?.key || ''}
        escala={modalData?.escala}
      />
    </div>
  )
}
