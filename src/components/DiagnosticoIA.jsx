import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'

function buildPrompt(ente, top3) {
  // Resumir indicadores do ente
  const resumo = Object.entries(PILARES).map(([pilarKey, pilar]) => {
    const comps = Object.entries(pilar.componentes).map(([compId, comp]) => {
      const vals = comp.itens.map(item => {
        const key = `${compId}.${item}`
        const v = ente.indicadores[key]?.valor ?? 0
        return v
      })
      const media = vals.reduce((a, b) => a + b, 0) / vals.length
      const escala = getEscala(media)
      return `${comp.label}: ${escala.label} (${Math.round(media * 100)}%)`
    }).join('; ')
    return `**${pilar.label}** (score ${ente.scores[pilarKey]}/100): ${comps}`
  }).join('\n')

  const top3Resumo = top3.map(e =>
    `${e.nome} (${e.uf}): Farol=${e.scores.farol}, Gov=${e.scores.governanca}, Pol=${e.scores.politicas}, Fin=${e.scores.financas}`
  ).join('\n')

  return `Você é um analista de governança climática do Brasil. Analise os dados do Painel ClimaBrasil para ${ente.nome} (${ente.uf}) e gere um diagnóstico em português.

DADOS DO ENTE:
Score Farol: ${ente.scores.farol}/100
${resumo}

TOP 3 REFERÊNCIAS (melhores práticas):
${top3Resumo}

Gere EXATAMENTE neste formato:
## Situação Atual
[2-3 frases sobre o nível de preparação climática deste ente]

## Lacunas Críticas
- [Lacuna 1 - a mais urgente]
- [Lacuna 2]
- [Lacuna 3]

## Recomendações
- [Ação 1 - concreta, referenciando entes líderes quando relevante]
- [Ação 2]
- [Ação 3]

Seja direto, sem jargão excessivo. Máximo 250 palavras.`
}

export default function DiagnosticoIA({ ente, todos }) {
  const [diagnostico, setDiagnostico] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  async function gerar() {
    setLoading(true)
    setErro(null)
    setDiagnostico('')

    const sorted = [...todos].sort((a, b) => b.scores.farol - a.scores.farol)
    const top3 = sorted.slice(0, 3)
    const prompt = buildPrompt(ente, top3)

    try {
      // Gemini API via generativelanguage
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
      if (!API_KEY) {
        setErro('Chave da API Gemini não configurada (VITE_GEMINI_API_KEY)')
        setLoading(false)
        return
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
          }),
        }
      )

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        setDiagnostico(text)
      } else {
        setErro('Resposta inesperada da API')
      }
    } catch (err) {
      setErro(`Erro ao gerar diagnóstico: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-amber-400" />
          Diagnóstico Inteligente
        </h3>
        {!diagnostico && !loading && (
          <button
            onClick={gerar}
            className="px-4 py-2 bg-[var(--color-accent)] hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles size={14} />
            Gerar análise
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)] py-8 justify-center">
          <Loader2 size={20} className="animate-spin" />
          <span>Analisando dados de {ente.nome}...</span>
        </div>
      )}

      {erro && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400">
          {erro}
        </div>
      )}

      {diagnostico && (
        <div className="prose prose-invert prose-sm max-w-none">
          {diagnostico.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h4 key={i} className="text-[#1a1a1a] font-semibold mt-4 mb-2 text-base">{line.replace('## ', '')}</h4>
            }
            if (line.startsWith('- ')) {
              return <p key={i} className="text-[var(--color-text-secondary)] ml-4 mb-1 text-sm">• {line.replace('- ', '')}</p>
            }
            if (line.trim()) {
              return <p key={i} className="text-[var(--color-text-secondary)] mb-2 text-sm">{line}</p>
            }
            return null
          })}
          <button
            onClick={gerar}
            className="mt-4 text-xs text-[var(--color-accent)] hover:underline"
          >
            Gerar novamente
          </button>
        </div>
      )}
    </div>
  )
}
