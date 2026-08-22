import { useState } from 'react'
import { ArrowLeft, GitCompareArrows, HelpCircle, X } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'
import { getCorScore, getLabelScore } from '../utils/scoring'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import DiagnosticoIA from './DiagnosticoIA'
import IniciativasEstado from './IniciativasEstado'
import ComentariosAuditoria from './ComentariosAuditoria'
import DadosComplementares from './DadosComplementares'
import DadosCPTEC from './DadosCPTEC'
import MapaRiscoEstado from './MapaRiscoEstado'
import OuvidoriaEstado from './OuvidoriaEstado'
import AlertasClima from './AlertasClima'

/* ── Explicações dos indicadores para o cidadão ── */
const EXPLICACOES = {
  farol: 'O Farol Clima é uma nota geral de 0 a 100 que mostra o quanto este estado ou capital está preparado para enfrentar problemas causados pelo clima, como enchentes, secas e ondas de calor. Quanto maior a nota, melhor a preparação.',
  governanca: 'Governança mede se o governo tem equipes, leis e planos organizados para lidar com mudanças do clima. Inclui: se existe um órgão responsável, se há leis sobre o assunto, se a população participa das decisões e se os dados são transparentes.',
  politicas: 'Políticas Públicas avalia se existem planos concretos para reduzir a poluição, se preparar para desastres e se recuperar depois deles. Inclui: plano de redução de gases poluentes, plano de adaptação para enchentes/secas, contagem de quanto o estado polui, e acompanhamento dos resultados.',
  financas: 'Financiamento mostra se o estado investe dinheiro em ações climáticas, se consegue acessar programas federais e internacionais de financiamento, e se atrai investimento privado para projetos verdes.',
  componente: {
    G1: 'Verifica se existe um órgão ou secretaria responsável pelas questões climáticas no estado.',
    G2: 'Avalia se existem leis estaduais sobre mudanças climáticas e meio ambiente.',
    G3: 'Mede se o estado identificou quais regiões e populações correm mais risco com enchentes, secas, etc.',
    G4: 'Verifica se o estado trabalha junto com outros governos (federal, municipal, outros estados) nas questões do clima.',
    G5: 'Avalia se a população pode participar das decisões sobre meio ambiente e clima.',
    G6: 'Mede se o estado tem ações específicas para proteger populações mais vulneráveis (comunidades ribeirinhas, favelas em encostas, etc.).',
    G7: 'Verifica se os dados e informações sobre clima estão disponíveis para qualquer cidadão consultar.',
    P1: 'Avalia se existe um plano concreto para reduzir a emissão de gases poluentes (como fumaça de carros e indústrias).',
    P2: 'Mede se o estado tem um plano para se preparar para os efeitos do clima (enchentes, calor extremo, falta de água).',
    P3: 'Verifica se o estado faz uma contagem de quanto CO₂ e outros gases poluentes são emitidos em seu território.',
    P4: 'Avalia se o estado acompanha e publica relatórios sobre o andamento de seus planos climáticos.',
    P5: 'Mede a capacidade do estado de se recuperar após um desastre (enchente, deslizamento, seca) e ajudar a população afetada.',
    F1: 'Verifica se existe dinheiro no orçamento do estado separado especificamente para ações contra mudanças climáticas.',
    F2: 'Avalia se o estado consegue acessar programas de financiamento do governo federal e de organismos internacionais.',
    F3: 'Mede se empresas privadas estão investindo em projetos verdes e sustentáveis no estado.',
  },
}

/* ── Tooltip "?" ── */
function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#bbb', display: 'flex', alignItems: 'center' }}
        title="O que significa?"
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: -10, zIndex: 999,
            width: 280, padding: '10px 14px', borderRadius: 10,
            background: 'white', border: '1px solid #e8e8e4',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            fontSize: 12, color: '#555', lineHeight: 1.5,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>O que significa?</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }}><X size={12} /></button>
            </div>
            {text}
          </div>
        </>
      )}
    </span>
  )
}

function PilarCard({ pilarKey, indicadores, score }) {
  const pilar = PILARES[pilarKey]
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: pilar.cor, display: 'inline-block' }} />
          {pilar.label}
          <InfoTooltip text={EXPLICACOES[pilarKey]} />
        </h3>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 20, fontWeight: 800, color: getCorScore(score) }}>{score}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(pilar.componentes).map(([compId, comp]) => {
          const vals = comp.itens.map(item => indicadores[`${compId}.${item}`]?.valor ?? 0)
          const media = vals.reduce((a, b) => a + b, 0) / vals.length
          const escala = getEscala(media)
          return (
            <div key={compId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {compId} · {comp.label}
                  <InfoTooltip text={EXPLICACOES.componente[compId] || `Indicador ${compId}: ${comp.label}`} />
                </span>
                <span style={{ color: escala.cor, fontWeight: 600 }}>{escala.label}</span>
              </div>
              <div style={{ height: 6, background: '#f0f0ee', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${media * 100}%`, background: escala.cor, transition: 'width 0.5s' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard({ ente, todos, onVoltar, onComparar }) {
  const { nome, uf, scores, indicadores } = ente
  const corFarol = getCorScore(scores.farol)
  const sorted = [...todos].sort((a, b) => b.scores.farol - a.scores.farol)
  const posicao = sorted.findIndex(e => e.uf === uf && e.nome === nome) + 1
  const radarData = [
    { subject: 'Governança', value: scores.governanca },
    { subject: 'Políticas', value: scores.politicas },
    { subject: 'Finanças', value: scores.financas },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Voltar
        </button>
        <button onClick={() => onComparar(ente)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', background: '#f0f0ee', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          <GitCompareArrows size={13} /> Comparar
        </button>
      </div>

      {/* Header */}
      <div className="card" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 4 }}>{ente.tipo === 'capital' ? 'Capital' : 'Estado'} · Posição {posicao}º de {sorted.length}</p>
          <h2 style={{ fontFamily: "'DM Sans'", fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{nome}</h2>
          <p style={{ fontSize: 14, color: '#888', marginTop: 2 }}>{uf} · Região {ente.regiao}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 48, fontWeight: 900, color: corFarol, lineHeight: 1 }}>{scores.farol}</div>
            <InfoTooltip text={EXPLICACOES.farol} />
          </div>
          <span style={{ display: 'inline-block', marginTop: 4, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: corFarol + '18', color: corFarol }}>{getLabelScore(scores.farol)}</span>
        </div>
      </div>

      {/* 🟡 DIAGNÓSTICO IA NO TOPO — para engajar o cidadão */}
      <DiagnosticoIA ente={ente} todos={todos} />

      {/* 🔵 OUVIDORIA — canal direto de reclamação */}
      <OuvidoriaEstado uf={uf} />

      <DadosComplementares uf={uf} />

      {/* CPTEC + Mapa de risco lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DadosCPTEC uf={uf} />
        <MapaRiscoEstado uf={uf} />
      </div>

      {/* Pilares + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 240px', gap: 16 }}>
        {Object.entries(PILARES).map(([key]) => (
          <PilarCard key={key} pilarKey={key} indicadores={indicadores} score={scores[key]} />
        ))}
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e8e8e4" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="#0F766E" fill="#0F766E" fillOpacity={0.12} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Iniciativas + Alertas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <IniciativasEstado ente={ente} />
        <AlertasClima uf={uf} />
      </div>

      <ComentariosAuditoria ente={ente} />
    </div>
  )
}
