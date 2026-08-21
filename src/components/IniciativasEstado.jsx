import { useState } from 'react'
import { Newspaper, Loader2, RefreshCw } from 'lucide-react'

function buildPrompt(ente) {
  return `Pesquise e liste de 4 a 6 iniciativas ou notícias RECENTES (2025-2026) sobre ações climáticas, ambientais ou de adaptação do estado/cidade de ${ente.nome} (${ente.uf}), Brasil.

Para cada iniciativa, forneça EXATAMENTE neste formato JSON (array):
[
  {
    "titulo": "Nome da iniciativa ou manchete",
    "descricao": "Descrição em 1-2 frases do que é e qual o impacto",
    "tipo": "lei|programa|investimento|parceria|infraestrutura|monitoramento",
    "data_aprox": "mês/ano aproximado",
    "fonte": "nome do veículo ou órgão"
  }
]

Inclua coisas como: planos climáticos aprovados, programas de adaptação, leis ambientais, investimentos em resiliência, parcerias com organismos internacionais, obras de contenção/drenagem, sistemas de alerta, programas de reflorestamento, fundos climáticos.

Se não encontrar informações específicas para ${ente.nome}, indique iniciativas federais que impactam o estado/cidade.

Responda APENAS com o JSON, sem markdown, sem backticks, sem texto adicional.`
}

export default function IniciativasEstado({ ente }) {
  const [iniciativas, setIniciativas] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  async function buscar() {
    setLoading(true)
    setErro(null)
    setIniciativas(null)

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
    if (!API_KEY) {
      setErro('Chave da API Gemini não configurada')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(ente) }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
          }),
        }
      )

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

      // Limpar e parsear JSON
      const clean = text.replace(/```json\n?/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(clean)
      setIniciativas(parsed)
    } catch (err) {
      setErro(`Erro ao buscar iniciativas: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const TIPO_CORES = {
    lei: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Legislação' },
    programa: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Programa' },
    investimento: { bg: 'bg-emerald-500/10', text: 'text-[#0F766E]', label: 'Investimento' },
    parceria: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Parceria' },
    infraestrutura: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', label: 'Infraestrutura' },
    monitoramento: { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'Monitoramento' },
  }

  return (
    <div className="card rounded-2xl  p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Newspaper size={18} className="text-[#0F766E]" />
          <h3 className="font-semibold text-sm">Iniciativas e Ações Climáticas</h3>
        </div>
        {!loading && (
          <button
            onClick={buscar}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              iniciativas
                ? 'text-[#777] hover:text-[#1a1a1a] hover:bg-white/5'
                : 'bg-[#F0FDFA] text-[#0F766E] hover:bg-[#CCFBF1]'
            }`}
          >
            {iniciativas ? <RefreshCw size={12} /> : <Newspaper size={12} />}
            {iniciativas ? 'Atualizar' : 'Buscar iniciativas'}
          </button>
        )}
      </div>

      {!iniciativas && !loading && !erro && (
        <p className="text-xs text-[#999] py-4 text-center">
          Clique em "Buscar iniciativas" para ver ações climáticas recentes de {ente.nome}.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-[#777] py-8 justify-center">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Pesquisando iniciativas de {ente.nome}...</span>
        </div>
      )}

      {erro && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
          {erro}
        </div>
      )}

      {iniciativas && (
        <div className="space-y-3">
          {iniciativas.map((ini, i) => {
            const tipo = TIPO_CORES[ini.tipo] || TIPO_CORES.programa
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#FAFAF8]  hover:border-[#ddd] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-medium text-[#333] leading-snug">{ini.titulo}</h4>
                  <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${tipo.bg} ${tipo.text}`}>
                    {tipo.label}
                  </span>
                </div>
                <p className="text-xs text-[#777] leading-relaxed mb-2">{ini.descricao}</p>
                <div className="flex items-center gap-3 text-[10px] text-[#999]">
                  {ini.data_aprox && <span>{ini.data_aprox}</span>}
                  {ini.fonte && <span>· {ini.fonte}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
