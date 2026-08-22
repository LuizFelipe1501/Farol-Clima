import { useState, useEffect } from 'react'
import Logo from './Logo'
import { ArrowRight, AlertTriangle, Globe, TrendingDown, Zap } from 'lucide-react'

const FEATURES = [
  { emoji: "🗺️", title: "Mapa interativo", desc: "Cada estado do Brasil colorido pelo seu nível de preparação climática." },
  { emoji: "📊", title: "Ranking e comparador", desc: "Compare até 3 estados lado a lado em todos os 45 indicadores." },
  { emoji: "🤖", title: "Diagnóstico com IA", desc: "Gemini analisa lacunas e recomenda ações baseadas nos estados líderes." },
  { emoji: "⚡", title: "Alertas em tempo real", desc: "Avisos meteorológicos do INMET atualizados a cada 10 minutos." },
  { emoji: "📰", title: "Iniciativas por estado", desc: "Notícias recentes de ações climáticas buscadas em tempo real." },
  { emoji: "📋", title: "Evidências da auditoria", desc: "Comentários oficiais dos auditores do Tribunal de Contas." },
]

function InsightCard({ insight }) {
  const styles = {
    alerta: { icon: AlertTriangle, bg: '#FEF2F2', border: '#FECACA', accent: '#DC2626' },
    info: { icon: Globe, bg: '#F0FDFA', border: '#99F6E4', accent: '#0F766E' },
    destaque: { icon: TrendingDown, bg: '#FFFBEB', border: '#FDE68A', accent: '#D97706' },
  }
  const s = styles[insight.tipo] || styles.info
  const Icon = s.icon
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '20px 22px' }}>
      <Icon size={18} style={{ color: s.accent, marginBottom: 10 }} />
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 6, lineHeight: 1.3, fontFamily: "'DM Sans'" }}>{insight.titulo}</h3>
      <p style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{insight.texto}</p>
    </div>
  )
}

export default function Landing({ onEntrar, totalEstados, totalCapitais }) {
  const [insights, setInsights] = useState(null)
  useEffect(() => { fetch('/data/insights.json').then(r => r.json()).then(setInsights) }, [])

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={42} />
            <span style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 15, color: '#0F766E', letterSpacing: '-0.02em' }}>FAROL CLIMA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#888', background: '#f0f0ee', padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>ClimatonBrasil 2026</span>
            <button onClick={onEntrar} style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#0F766E', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer' }}>
              Acessar painel →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #042F2E 0%, #134E4A 30%, #0C4A6E 70%, #1E1B4B 100%)', color: 'white', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', padding: '5px 14px', borderRadius: 20, marginBottom: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Tribunal de Contas da União · ClimatonBrasil 2026</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <Logo size={120} />
          </div>
          <h1 style={{ fontFamily: "'DM Sans'", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 20, maxWidth: 700 }}>
            Seu estado está<br/><span style={{ color: '#5EEAD4' }}>preparado</span> para o<br/>El Niño 2026?
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.6, marginBottom: 36 }}>
            Diagnóstico visual da governança climática dos 27 estados e 24 capitais a partir dos dados oficiais do Painel ClimaBrasil.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onEntrar} style={{ fontSize: 14, fontWeight: 600, color: '#042F2E', background: '#5EEAD4', border: 'none', padding: '12px 28px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              Explorar os dados <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%' }} preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60Z" fill="#FAFAF8"/>
        </svg>
      </section>

      {/* Brasil no mundo */}
      {insights && (
        <section style={{ padding: '60px 24px', borderBottom: '1px solid #e8e8e4' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 16, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 32, fontWeight: 900, color: '#DC2626' }}>{insights.global.brasil_posicao}º</span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Posição global</p>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>de {insights.global.total_paises} países</p>
              </div>
            </div>
            <p style={{ flex: 1, minWidth: 280, fontSize: 15, color: '#666', lineHeight: 1.7 }}>
              O Brasil ocupa a <strong style={{ color: '#DC2626' }}>{insights.global.brasil_posicao}ª posição</strong> entre {insights.global.total_paises} países no ClimateScanner, com score de <strong style={{ color: '#1a1a1a' }}>{insights.global.brasil_score}/100</strong>. Financiamento climático é o pilar mais fraco.
            </p>
          </div>
        </section>
      )}

      {/* Stats */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          {[
            { value: totalEstados, label: 'Estados', cor: '#0F766E' },
            { value: totalCapitais, label: 'Capitais', cor: '#0EA5E9' },
            { value: '45', label: 'Indicadores', cor: '#7C3AED' },
            { value: '3', label: 'Pilares', cor: '#D97706' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 20, background: 'white', borderRadius: 14, border: '1px solid #e8e8e4' }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 28, fontWeight: 800, color: s.cor }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section style={{ padding: '32px 24px 56px', maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Sans'", fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>Por que isso importa</h2>
        <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, marginBottom: 16 }}>
          O Painel ClimaBrasil, desenvolvido pelo ClimateScanner e aplicado pelos Tribunais de Contas, avalia <strong style={{ color: '#1a1a1a' }}>45 indicadores</strong> de preparação climática em três pilares: governança, políticas públicas e financiamento.
        </p>
        <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, marginBottom: 16 }}>
          Os resultados mostram que a <strong style={{ color: '#1a1a1a' }}>maioria dos estados não está preparada</strong>. Apenas um terço atinge score acima de 50. Nenhum monitora adequadamente seus gastos climáticos. E com o Super El Niño de 2026 em curso, a janela de ação está fechando.
        </p>
        <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8 }}>
          O <strong style={{ color: '#0F766E' }}>Farol Clima</strong> transforma esses dados em uma ferramenta visual para que <strong style={{ color: '#1a1a1a' }}>cidadãos cobrem</strong> e <strong style={{ color: '#1a1a1a' }}>gestores ajam</strong>.
        </p>
      </section>

      {/* Insights */}
      {insights && insights.destaques.length > 0 && (
        <section style={{ padding: '48px 24px 56px', background: '#F3F3F0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>Análise automática</p>
            <h2 style={{ fontFamily: "'DM Sans'", fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 28, letterSpacing: '-0.02em' }}>Principais achados</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {insights.destaques.map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ padding: '56px 24px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>Plataforma</p>
          <h2 style={{ fontFamily: "'DM Sans'", fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 32, letterSpacing: '-0.02em' }}>O que o Farol Clima oferece</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ padding: '24px', cursor: 'default', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <h3 style={{ fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 700, marginTop: 12, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '56px 24px 64px', textAlign: 'center', background: 'linear-gradient(180deg, #FAFAF8, #F3F3F0)' }}>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Dados que ninguém vê não mudam nada.</p>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Explore a governança climática do seu estado.</p>
        <button onClick={onEntrar} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#0F766E', border: 'none', padding: '14px 32px', borderRadius: 10, cursor: 'pointer' }}>
          Acessar o Farol Clima →
        </button>
      </section>

      {/* Sources */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid #e8e8e4', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {['Painel ClimaBrasil (TCU)', 'ClimateScanner', 'INPE', 'CEMADEN', 'IBGE', 'INMET'].map((s, i) => (
          <span key={i} style={{ fontSize: 10, color: '#aaa', fontWeight: 500, padding: '3px 10px', background: '#f5f5f3', borderRadius: 5 }}>{s}</span>
        ))}
      </div>

      <footer style={{ padding: '14px 24px', textAlign: 'center', fontSize: 11, color: '#ccc', borderTop: '1px solid #e8e8e4' }}>
        Farol Clima · ClimatonBrasil 2026 · Tribunal de Contas da União
      </footer>
    </div>
  )
}
