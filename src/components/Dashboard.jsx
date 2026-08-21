import { ArrowLeft, GitCompareArrows } from 'lucide-react'
import { PILARES, getEscala } from '../data/constants'
import { getCorScore, getLabelScore } from '../utils/scoring'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import DiagnosticoIA from './DiagnosticoIA'
import IniciativasEstado from './IniciativasEstado'
import ComentariosAuditoria from './ComentariosAuditoria'
import DadosComplementares from './DadosComplementares'
import DadosCPTEC from './DadosCPTEC'
import MapaRiscoEstado from './MapaRiscoEstado'
import AlertasClima from './AlertasClima'
import OuvidoriaLink from './OuvidoriaLink'

function PilarCard({ pilarKey, indicadores, score }) {
  const pilar = PILARES[pilarKey]
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: pilar.cor, display: 'inline-block' }} />
          {pilar.label}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#888' }}>{compId} · {comp.label}</span>
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
      {/* Nav */}
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
          <div style={{ fontFamily: "'DM Sans'", fontSize: 48, fontWeight: 900, color: corFarol, lineHeight: 1 }}>{scores.farol}</div>
          <span style={{ display: 'inline-block', marginTop: 4, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: corFarol + '18', color: corFarol }}>{getLabelScore(scores.farol)}</span>
        </div>
      </div>

      {/* 🔥 DIAGNÓSTICO IA NO TOPO — maior engajamento */}
      <DiagnosticoIA ente={ente} todos={todos} />

      {/* Ouvidoria */}
      <OuvidoriaLink uf={uf} nome={nome} />

      {/* Dados complementares */}
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

      {/* Evidências da auditoria */}
      <ComentariosAuditoria ente={ente} />
    </div>
  )
}
