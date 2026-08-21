import { useState, useEffect } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'

function buildPrompt(ente, top3) {
  const resumo = Object.entries(PILARES).map(([pilarKey, pilar]) => {
    const comps = Object.entries(pilar.componentes).map(([compId, comp]) => {
      const vals = comp.itens.map(item => {
        const key = `${compId}.${item}`
        return ente.indicadores[key]?.valor ?? 0
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

  return `Você é um comunicador público que traduz dados técnicos para a população geral. Analise os dados do Painel ClimaBrasil para ${ente.nome} (${ente.uf}) e gere um diagnóstico que qualquer cidadão entenda, mesmo sem conhecimento técnico sobre clima.

REGRAS DE LINGUAGEM:
- Use linguagem simples e direta, como se estivesse explicando para um vizinho
- Evite termos técnicos. Se precisar usar algum, explique entre parênteses
- Use exemplos concretos do dia a dia quando possível
- Em vez de "governança climática", diga "preparo do estado para enfrentar problemas do clima"
- Em vez de "mitigação", diga "redução da poluição que esquenta o planeta"
- Em vez de "adaptação", diga "preparo para lidar com secas, enchentes e calor extremo"
- Fale sobre impactos que as pessoas sentem: água, energia, saúde, transporte, comida

DADOS DO ENTE:
Score Farol: ${ente.scores.farol}/100
${resumo}

TOP 3 ESTADOS MAIS PREPARADOS (referência):
${top3Resumo}

Gere EXATAMENTE neste formato:

## Como está ${ente.nome}?
[2-3 frases simples explicando se o estado está bem ou mal preparado para problemas do clima como secas, enchentes e calor extremo. Use nota de escola como analogia se ajudar.]

## O que está faltando?
- [Problema 1 que afeta a vida das pessoas - o mais urgente]
- [Problema 2]
- [Problema 3]

## O que pode ser feito?
- [Ação 1 - concreta e compreensível, mencionando estados que já fizeram isso]
- [Ação 2]
- [Ação 3]

## O que você pode fazer como cidadão?
- [Ação cidadã 1 - algo que a pessoa pode fazer para cobrar ou contribuir]
- [Ação cidadã 2]

Máximo 300 palavras. Tom respeitoso mas direto.`
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
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
          }),
        }
      )

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) setDiagnostico(text)
      else setErro('Resposta inesperada da API')
    } catch (err) {
      setErro(`Erro ao gerar diagnóstico: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Auto-gerar ao montar
  useEffect(() => { gerar() }, [ente.uf])

  return (
    <div className="card" style={{ padding: '24px 28px', borderLeft: '4px solid #0F766E' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: '#F59E0B' }} />
          <h3 style={{ fontFamily: "'DM Sans'", fontSize: 16, fontWeight: 700 }}>
            O que está acontecendo em {ente.nome}?
          </h3>
        </div>
        {diagnostico && (
          <button onClick={gerar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <RefreshCw size={12} /> Atualizar
          </button>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
        Análise gerada por inteligência artificial a partir dos dados oficiais do Painel ClimaBrasil. Linguagem simplificada para todos os públicos.
      </p>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 0', color: '#999' }}>
          <Loader2 size={18} className="animate-spin" />
          <span style={{ fontSize: 13 }}>Analisando dados de {ente.nome}...</span>
        </div>
      )}

      {erro && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 14, fontSize: 13, color: '#DC2626' }}>
          {erro}
          <button onClick={gerar} style={{ display: 'block', marginTop: 8, fontSize: 12, color: '#0F766E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Tentar novamente
          </button>
        </div>
      )}

      {diagnostico && (
        <div>
          {diagnostico.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h4 key={i} style={{ fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginTop: i > 0 ? 20 : 0, marginBottom: 8 }}>{line.replace('## ', '')}</h4>
            }
            if (line.startsWith('- ')) {
              return <p key={i} style={{ fontSize: 14, color: '#555', marginLeft: 12, marginBottom: 6, lineHeight: 1.6, paddingLeft: 8, borderLeft: '2px solid #e8e8e4' }}>{line.replace('- ', '')}</p>
            }
            if (line.trim()) {
              return <p key={i} style={{ fontSize: 14, color: '#555', marginBottom: 8, lineHeight: 1.7 }}>{line}</p>
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
