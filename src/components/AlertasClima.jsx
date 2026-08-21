import { useState, useEffect } from 'react'
import { AlertTriangle, CloudRain, Thermometer, Wind, Droplets, RefreshCw } from 'lucide-react'

const SEVERIDADE_CORES = {
  'Perigo Potencial': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  'Perigo': { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-400' },
  'Grande Perigo': { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
}

const EVENTO_ICONS = {
  'Chuvas Intensas': CloudRain,
  'Tempestade': Wind,
  'Baixa Umidade': Droplets,
  'Onda de Calor': Thermometer,
}

function getIcon(evento) {
  for (const [key, Icon] of Object.entries(EVENTO_ICONS)) {
    if (evento?.includes(key)) return Icon
  }
  return AlertTriangle
}

export default function AlertasClima({ uf }) {
  const [alertas, setAlertas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  async function fetchAlertas() {
    setLoading(true)
    try {
      const r = await fetch(`https://radarmeteorologico.com.br/api/v1/alertas?uf=${uf}`)
      const data = await r.json()
      setAlertas(data.alertas || [])
      setLastUpdate(new Date())
    } catch (e) {
      console.error('Erro ao buscar alertas:', e)
      setAlertas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlertas()
    const interval = setInterval(fetchAlertas, 10 * 60 * 1000) // 10 min
    return () => clearInterval(interval)
  }, [uf])

  return (
    <div className="card rounded-xl  p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          <h3 className="font-semibold text-sm">Alertas Meteorológicos</h3>
          <span className="text-[9px] text-[#999] bg-[#f5f5f3] px-2 py-0.5 rounded-full">TEMPO REAL</span>
        </div>
        <button
          onClick={fetchAlertas}
          className="text-[#999] hover:text-[#1a1a1a] p-1 transition-colors"
          title="Atualizar"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && !alertas && (
        <div className="py-6 text-center text-xs text-[#999]">Buscando alertas do INMET...</div>
      )}

      {alertas && alertas.length === 0 && (
        <div className="py-4 text-center">
          <p className="text-xs text-emerald-400 font-medium">Nenhum alerta em vigor para {uf}</p>
          <p className="text-[10px] text-[#999] mt-1">Última verificação: {lastUpdate?.toLocaleTimeString('pt-BR')}</p>
        </div>
      )}

      {alertas && alertas.length > 0 && (
        <div className="space-y-2.5">
          {alertas.map((alerta, i) => {
            const sev = SEVERIDADE_CORES[alerta.severidade] || SEVERIDADE_CORES['Perigo Potencial']
            const Icon = getIcon(alerta.evento)

            return (
              <div key={i} className={`${sev.bg} ${sev.border} border rounded-lg p-3.5`}>
                <div className="flex items-start gap-2.5">
                  <Icon size={16} className={sev.text + ' shrink-0 mt-0.5'} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold ${sev.text}`}>{alerta.evento}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                        {alerta.severidade}
                      </span>
                    </div>
                    {alerta.descricao && (
                      <p className="text-[11px] text-[#777] leading-relaxed mb-1.5">
                        {alerta.descricao.length > 200 ? alerta.descricao.slice(0, 200) + '...' : alerta.descricao}
                      </p>
                    )}
                    {alerta.riscos && (
                      <p className="text-[10px] text-[#999] mb-1">
                        <strong className="text-[#777]">Riscos:</strong> {alerta.riscos}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[9px] text-[#999] mt-1.5">
                      {alerta.inicio && <span>Início: {new Date(alerta.inicio).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
                      {alerta.fim && <span>Fim: {new Date(alerta.fim).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
                      {alerta.municipios_afetados && <span>{alerta.municipios_afetados} municípios</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <p className="text-[9px] text-[#ccc] mt-2">
            Fonte: INMET via RadarMeteorológico · Atualizado a cada 10 min · {lastUpdate?.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  )
}
