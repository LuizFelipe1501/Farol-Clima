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
    return `**${pilar.label}** (nota ${ente.scores[pilarKey]}/100): ${comps}`
  }).join('\n')

  const top3Resumo = top3.map(e =>
    `${e.nome} (${e.uf}): Nota geral=${e.scores.farol}`
  ).join(', ')

  return `Você é um comunicador público que explica questões climáticas de forma simples e direta para cidadãos brasileiros comuns. Analise os dados abaixo sobre ${ente.nome} (${ente.uf}) e gere um diagnóstico que QUALQUER PESSOA consiga entender, mesmo sem conhecimento técnico.

DADOS:
Nota geral: ${ente.scores.farol}/100
${resumo}

Melhores do Brasil: ${top3Resumo}

REGRAS DE LINGUAGEM:
- Use frases curtas e palavras do dia a dia
- Evite COMPLETAMENTE termos técnicos como "mitigação", "adaptação", "resiliência", "governança", "inventário de emissões". Quando precisar falar desses conceitos, use explicações simples como: "plano para reduzir a poluição", "preparação para enchentes e secas", "capacidade de se recuperar de desastres", "organização do governo", "contagem de quanto polui"
- Use exemplos concretos: enchentes, calor forte, falta d'água, deslizamentos, queimadas
- Fale como se estivesse explicando para um vizinho ou familiar
- Use emojis moderadamente para tornar visual

Gere EXATAMENTE neste formato:

## Como está ${ente.nome}?
[2-3 frases simples explicando se o estado/cidade está bem preparado ou não para problemas do clima como enchentes, calor extremo, secas. Use comparações: "está entre os melhores", "está ficando para trás", "precisa melhorar muito"]

## O que preocupa?
- 🔴 [Problema 1 - explique de forma que um cidadão entenda o impacto no dia a dia]
- 🟡 [Problema 2]
- 🟡 [Problema 3]

## O que pode ser feito?
- ✅ [Ação 1 - concreta e compreensível, ex: "Criar um plano de emergência para quando chover muito forte"]
- ✅ [Ação 2 - cite exemplos de outros estados que já fizeram isso]
- ✅ [Ação 3]

## Você sabia?
[1 frase com um dado ou comparação surpreendente para engajar o cidadão]

Máximo 280 palavras. Linguagem coloquial mas respeitosa.`
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
      if (!API_KEY) { setErro('Chave da API Gemini não configurada'); setLoading(false); return }

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

  // Auto-gerar ao abrir a página do estado
  useEffect(() => {
    if (ente?.uf) gerar()
  }, [ente?.uf])

  return (
    <div className="card" style={{ padding: 24, border: '2px solid #F59E0B33', background: 'linear-gradient(135deg, #FFFBEB 0%, white 30%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={20} style={{ color: '#F59E0B' }} />
          <div>
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "'DM Sans'", color: '#1a1a1a' }}>
              Diagnóstico para o Cidadão
            </span>
            <span style={{ display: 'block', fontSize: 10, color: '#999' }}>
              Análise inteligente em linguagem acessível
            </span>
          </div>
        </div>
        {!diagnostico && !loading && (
          <button
            onClick={gerar}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Sparkles size={15} />
            Gerar diagnóstico
          </button>
        )}
        {diagnostico && (
          <button onClick={gerar} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#D97706', background: '#FEF3C7', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
            <RefreshCw size={12} /> Atualizar
          </button>
        )}
      </div>

      {!diagnostico && !loading && !erro && (
        <p style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '12px 0' }}>
          Clique em "Gerar diagnóstico" para receber uma análise clara sobre a situação climática de {ente.nome} em linguagem simples.
        </p>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', padding: 24, color: '#D97706' }}>
          <Loader2 size={20} className="animate-spin" />
          <span style={{ fontSize: 13 }}>Preparando diagnóstico de {ente.nome} para você...</span>
        </div>
      )}

      {erro && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 12, fontSize: 12, color: '#DC2626' }}>
          {erro}
        </div>
      )}

      {diagnostico && (
        <div>
          {diagnostico.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h4 key={i} style={{ color: '#1a1a1a', fontWeight: 700, marginTop: 16, marginBottom: 8, fontSize: 14, fontFamily: "'DM Sans'" }}>{line.replace('## ', '')}</h4>
            }
            if (line.startsWith('- ')) {
              return <p key={i} style={{ color: '#555', marginLeft: 8, marginBottom: 4, fontSize: 13, lineHeight: 1.6 }}>{line.replace('- ', '')}</p>
            }
            if (line.trim()) {
              return <p key={i} style={{ color: '#555', marginBottom: 6, fontSize: 13, lineHeight: 1.6 }}>{line}</p>
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
