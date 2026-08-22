import { useState, useEffect } from 'react'
import Logo from './Logo'
import { ArrowRight, AlertTriangle, Globe, TrendingDown } from 'lucide-react'

const FEATURES = [
  { emoji: "🗺️", title: "Mapa interativo", desc: "Cada estado colorido pelo nível de preparação climática." },
  { emoji: "📊", title: "Ranking e comparador", desc: "Compare até 3 estados lado a lado nos 45 indicadores." },
  { emoji: "🤖", title: "Diagnóstico com IA", desc: "Análise das lacunas com recomendações em linguagem simples." },
  { emoji: "⚡", title: "Alertas em tempo real", desc: "Avisos meteorológicos do INMET atualizados a cada 10 min." },
  { emoji: "📰", title: "Iniciativas por estado", desc: "Notícias de ações climáticas buscadas em tempo real." },
  { emoji: "📋", title: "Evidências da auditoria", desc: "Comentários dos auditores do Tribunal de Contas." },
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
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
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
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={36} />
            <span style={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 15, color: '#0F766E', letterSpacing: '-0.02em' }}>FAROL CLIMA</span>
          </div>
          <button onClick={onEntrar} style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#0F766E', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer' }}>
            Acessar painel →
          </button>
        </div>
      </nav>

      {/* Hero - fundo claro com gradiente suave */}
      <section style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FAF8 50%, #E8F5F0 100%)',
        padding: '110px 16px 60px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 16px', borderRadius: 20, marginBottom: 28, border: '1px solid #e8e8e4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F766E' }} />
            <span style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>Tribunal de Contas da União · ClimatonBrasil 2026</span>
          </div>

          {/* Logo centralizada e grande */}
          <div style={{ marginBottom: 24 }}>
            <Logo size={200} />
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'DM Sans'", fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 14, color: '#1a1a1a' }}>
            Seu estado está preparado<br/>para as <span style={{ color: '#0F766E' }}>Mudanças Climáticas </span>?
          </h1>

          <p style={{ fontSize: 15, color: '#777', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, marginBottom: 28 }}>
            Diagnóstico visual da governança climática dos 27 estados e 24 capitais a partir dos dados do Painel ClimaBrasil.
          </p>

          {/* CTA */}
          <button onClick={onEntrar} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#0F766E', border: 'none', padding: '14px 36px', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(15,118,110,0.25)' }}>
            Explorar os dados <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Brasil no mundo */}
      {insights && (
        <section style={{ padding: '48px 16px', borderBottom: '1px solid #e8e8e4' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 14, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 28, fontWeight: 900, color: '#DC2626' }}>{insights.global.brasil_posicao}º</span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Posição global</p>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 18, fontWeight: 700 }}>de {insights.global.total_paises} países</p>
              </div>
            </div>
            <p style={{ flex: 1, minWidth: 240, fontSize: 14, color: '#666', lineHeight: 1.7 }}>
              O Brasil ocupa a <strong style={{ color: '#DC2626' }}>{insights.global.brasil_posicao}ª posição</strong> entre {insights.global.total_paises} países no ClimateScanner, com nota <strong style={{ color: '#1a1a1a' }}>{insights.global.brasil_score}/100</strong>.
            </p>
          </div>
        </section>
      )}

      {/* Stats */}
      <section style={{ padding: '40px 16px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { value: totalEstados, label: 'Estados', cor: '#0F766E' },
            { value: totalCapitais, label: 'Capitais', cor: '#0EA5E9' },
            { value: '45', label: 'Indicadores', cor: '#7C3AED' },
            { value: '3', label: 'Pilares', cor: '#D97706' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px 8px', background: 'white', borderRadius: 12, border: '1px solid #e8e8e4' }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 24, fontWeight: 800, color: s.cor }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrativa */}
      <section style={{ padding: '24px 16px 48px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Sans'", fontSize: 24, fontWeight: 800, marginBottom: 14 }}>Por que isso importa</h2>
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>
          O Painel ClimaBrasil avalia <strong style={{ color: '#1a1a1a' }}>45 indicadores</strong> de preparação climática em três pilares: como o governo se organiza, o que planeja fazer, e quanto investe.
        </p>
        <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>
          A maioria dos estados <strong style={{ color: '#1a1a1a' }}>não está preparada</strong>. Com o Super El Niño de 2026 em curso, o <strong style={{ color: '#0F766E' }}>Farol Clima</strong> transforma esses dados em algo que cidadãos e gestores consigam usar.
        </p>
      </section>

      {/* Insights */}
      {insights && insights.destaques.length > 0 && (
        <section style={{ padding: '40px 16px 48px', background: '#F3F3F0' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 6, textAlign: 'center' }}>Análise automática</p>
            <h2 style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>Principais achados</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {insights.destaques.map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ padding: '48px 16px 56px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>O que o Farol Clima oferece</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ padding: 20, cursor: 'default' }}>
                <span style={{ fontSize: 26 }}>{f.emoji}</span>
                <h3 style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 700, marginTop: 10, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '48px 16px 56px', textAlign: 'center', background: '#F3F3F0' }}>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Dados que ninguém vê não mudam nada.</p>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Explore a governança climática do seu estado.</p>
        <button onClick={onEntrar} style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#0F766E', border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer' }}>
          Acessar o Farol Clima →
        </button>
      </section>

      {/* Fontes */}
      <div style={{ padding: '16px', borderTop: '1px solid #e8e8e4', display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {['Painel ClimaBrasil (TCU)', 'ClimateScanner', 'INPE', 'CEMADEN', 'IBGE', 'INMET'].map((s, i) => (
          <span key={i} style={{ fontSize: 10, color: '#aaa', fontWeight: 500, padding: '3px 8px', background: '#f5f5f3', borderRadius: 4 }}>{s}</span>
        ))}
      </div>

      <footer style={{ padding: '12px 16px', textAlign: 'center', fontSize: 10, color: '#ccc' }}>
        Farol Clima · ClimatonBrasil 2026 · Tribunal de Contas da União
      </footer>
    </div>
  )
}
