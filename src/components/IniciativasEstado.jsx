import { useState } from 'react'
import { Newspaper, Loader2, RefreshCw, ExternalLink, Search } from 'lucide-react'

function buildPrompt(ente) {
  return `Pesquise e liste de 4 a 6 iniciativas ou notícias RECENTES (2025-2026) sobre ações climáticas, ambientais ou de adaptação do estado/cidade de ${ente.nome} (${ente.uf}), Brasil.

Para cada iniciativa, forneça EXATAMENTE neste formato JSON (array):
[
  {
    "titulo": "Nome da iniciativa ou manchete exata da notícia",
    "descricao": "Descrição em 1-2 frases do que é e qual o impacto",
    "tipo": "lei|programa|investimento|parceria|infraestrutura|monitoramento",
    "data_aprox": "mês/ano aproximado",
    "fonte": "nome do veículo ou órgão (ex: G1, Agência Brasil, Gov.br, Portal do Estado)",
    "busca": "palavras-chave para buscar a notícia original (ex: plano clima São Paulo 2025 PEMC)"
  }
]

Inclua coisas como: planos climáticos aprovados, programas de adaptação, leis ambientais, investimentos em resiliência, parcerias com organismos internacionais, obras de contenção/drenagem, sistemas de alerta, programas de reflorestamento, fundos climáticos.

IMPORTANTE: o campo "busca" deve conter palavras-chave específicas o bastante para encontrar a notícia original no Google. Inclua nomes de leis, programas, números, datas e o nome da fonte.

Se não encontrar informações específicas para ${ente.nome}, indique iniciativas federais que impactam o estado/cidade.

Responda APENAS com o JSON, sem markdown, sem backticks, sem texto adicional.`
}

function buildSearchUrl(ini) {
  // Construir URL de busca do Google News a partir do título + fonte + estado
  const query = ini.busca
    ? ini.busca
    : `${ini.titulo} ${ini.fonte || ''}`
  return `https://www.google.com/search?q=${encodeURIComponent(query.trim())}&tbm=nws`
}

function buildGoogleUrl(ini) {
  // Busca geral do Google (fallback mais amplo)
  const query = ini.busca
    ? ini.busca
    : `${ini.titulo} ${ini.fonte || ''}`
  return `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`
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
            generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
          }),
        }
      )

      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

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
            const newsUrl = buildSearchUrl(ini)
            const googleUrl = buildGoogleUrl(ini)

            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#FAFAF8] hover:border-[#ddd] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-medium text-[#333] leading-snug">{ini.titulo}</h4>
                  <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${tipo.bg} ${tipo.text}`}>
                    {tipo.label}
                  </span>
                </div>
                <p className="text-xs text-[#777] leading-relaxed mb-3">{ini.descricao}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-[10px] text-[#999]">
                    {ini.data_aprox && <span>{ini.data_aprox}</span>}
                    {ini.fonte && <span>· {ini.fonte}</span>}
                  </div>

                  {/* Botões de redirecionamento real */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <a
                      href={newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 10, color: '#0EA5E9', fontWeight: 600,
                        textDecoration: 'none', padding: '4px 10px',
                        borderRadius: 6, background: '#F0F9FF',
                        border: '1px solid #E0F2FE',
                        transition: 'all 0.15s', cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#DBEAFE'; e.currentTarget.style.borderColor = '#93C5FD' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F0F9FF'; e.currentTarget.style.borderColor = '#E0F2FE' }}
                    >
                      <ExternalLink size={10} />
                      Ver notícia
                    </a>
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 10, color: '#888', fontWeight: 500,
                        textDecoration: 'none', padding: '4px 8px',
                        borderRadius: 6, background: '#F5F5F3',
                        border: '1px solid #E8E8E4',
                        transition: 'all 0.15s', cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#EEEEEC'; e.currentTarget.style.color = '#555' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F5F5F3'; e.currentTarget.style.color = '#888' }}
                    >
                      <Search size={10} />
                      Buscar
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
          <p className="text-[9px] text-[#ccc] mt-2">
            Os links redirecionam para o Google Notícias com palavras-chave da iniciativa. A fonte original pode ser acessada nos resultados da busca.
          </p>
        </div>
      )}
    </div>
  )
}
