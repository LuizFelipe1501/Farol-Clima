import { MessageSquareWarning, ExternalLink, Phone, Mail } from 'lucide-react'

const OUVIDORIAS = {
  AC: { url: 'https://ouvidoria.ac.gov.br', tel: '0800-647-1341', nome: 'Ouvidoria-Geral do Acre' },
  AL: { url: 'https://ouvidoria.al.gov.br', tel: '0800-284-0084', nome: 'Ouvidoria-Geral de Alagoas' },
  AM: { url: 'https://ouvidoria.am.gov.br', tel: '0800-092-1516', nome: 'Ouvidoria-Geral do Amazonas' },
  AP: { url: 'https://ouvidoria.portal.ap.gov.br', tel: '(96) 3312-1890', nome: 'Ouvidoria-Geral do Amapá' },
  BA: { url: 'https://www.ouvidoriageral.ba.gov.br', tel: '0800-284-0011', nome: 'Ouvidoria-Geral da Bahia' },
  CE: { url: 'https://cearatransparente.ce.gov.br/ouvidoria', tel: '155', nome: 'Ouvidoria-Geral do Ceará' },
  DF: { url: 'https://ouv.df.gov.br', tel: '162', nome: 'Ouvidoria-Geral do DF' },
  ES: { url: 'https://ouvidoria.es.gov.br', tel: '0800-022-1027', nome: 'Ouvidoria-Geral do ES' },
  GO: { url: 'https://www.cge.go.gov.br/ouvidoria', tel: '0800-646-2001', nome: 'Ouvidoria-Geral de Goiás' },
  MA: { url: 'https://ouvidorias.cge.ma.gov.br', tel: '0800-098-0040', nome: 'Ouvidoria-Geral do Maranhão' },
  MG: { url: 'https://www.ouvidoriageral.mg.gov.br', tel: '162', nome: 'Ouvidoria-Geral de MG' },
  MS: { url: 'https://www.ouvidoria.ms.gov.br', tel: '0800-647-0900', nome: 'Ouvidoria-Geral de MS' },
  MT: { url: 'https://www.ouvidoria.mt.gov.br', tel: '0800-647-0077', nome: 'Ouvidoria-Geral de MT' },
  PA: { url: 'https://www.ouvidoria.pa.gov.br', tel: '0800-024-0011', nome: 'Ouvidoria-Geral do Pará' },
  PB: { url: 'https://ouvidoria.pb.gov.br', tel: '0800-281-8252', nome: 'Ouvidoria-Geral da Paraíba' },
  PE: { url: 'https://www.ouvidoria.pe.gov.br', tel: '0800-081-1311', nome: 'Ouvidoria-Geral de PE' },
  PI: { url: 'https://ouvidoria.pi.gov.br', tel: '0800-280-0166', nome: 'Ouvidoria-Geral do Piauí' },
  PR: { url: 'https://www.ouvidoria.pr.gov.br', tel: '0800-041-1113', nome: 'Ouvidoria-Geral do Paraná' },
  RJ: { url: 'https://www.ouvidoria.rj.gov.br', tel: '0800-021-0039', nome: 'Ouvidoria-Geral do RJ' },
  RN: { url: 'https://ouvidoria.rn.gov.br', tel: '0800-281-3138', nome: 'Ouvidoria-Geral do RN' },
  RO: { url: 'https://ouvidoria.ro.gov.br', tel: '0800-647-7220', nome: 'Ouvidoria-Geral de Rondônia' },
  RR: { url: 'https://ouvidoria.rr.gov.br', tel: '0800-095-4005', nome: 'Ouvidoria-Geral de Roraima' },
  RS: { url: 'https://www.ouvidoria.rs.gov.br', tel: '0800-510-0009', nome: 'Ouvidoria-Geral do RS' },
  SC: { url: 'https://ouvidoria.sc.gov.br', tel: '0800-644-8500', nome: 'Ouvidoria-Geral de SC' },
  SE: { url: 'https://www.ouvidoria.se.gov.br', tel: '0800-284-5353', nome: 'Ouvidoria-Geral de Sergipe' },
  SP: { url: 'https://www.ouvidoria.sp.gov.br', tel: '0800-372-6890', nome: 'Ouvidoria-Geral de SP' },
  TO: { url: 'https://ouvidoria.to.gov.br', tel: '0800-063-0162', nome: 'Ouvidoria-Geral do Tocantins' },
}

export default function OuvidoriaEstado({ uf }) {
  const ouv = OUVIDORIAS[uf]
  if (!ouv) return null

  return (
    <div className="card" style={{ padding: 16, background: 'linear-gradient(135deg, #EFF6FF 0%, white 40%)', border: '1px solid #BFDBFE' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <MessageSquareWarning size={18} style={{ color: '#2563EB' }} />
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'", color: '#1a1a1a' }}>Ouvidoria — Faça sua reclamação</span>
          <span style={{ display: 'block', fontSize: 10, color: '#888' }}>Relate problemas ambientais, enchentes, queimadas ou falta de ação do governo</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <a
          href={ouv.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 10,
            background: '#2563EB', color: 'white', textDecoration: 'none',
            fontSize: 12, fontWeight: 700, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
          onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
        >
          <ExternalLink size={14} />
          Acessar {ouv.nome}
        </a>

        <a
          href={`tel:${ouv.tel.replace(/[^\d]/g, '')}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 10,
            background: '#DBEAFE', color: '#2563EB', textDecoration: 'none',
            fontSize: 12, fontWeight: 600, border: '1px solid #BFDBFE',
          }}
        >
          <Phone size={13} />
          {ouv.tel}
        </a>
      </div>

      <div style={{ background: '#F0F9FF', borderRadius: 8, padding: '8px 12px', border: '1px solid #E0F2FE' }}>
        <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5, margin: 0 }}>
          💡 <strong>Dica:</strong> ao registrar sua reclamação, mencione o bairro ou região afetada, o tipo de problema (enchente, calor extremo, falta de árvores, queimada, deslizamento) e há quanto tempo a situação persiste. Quanto mais detalhada sua descrição, mais rápido será o atendimento.
        </p>
      </div>

      <p style={{ fontSize: 9, color: '#bbb', marginTop: 8 }}>
        Você também pode denunciar pelo portal federal: <a href="https://falabr.cgu.gov.br" target="_blank" rel="noopener noreferrer" style={{ color: '#0EA5E9' }}>FalaBR (CGU)</a> · Emergências: Defesa Civil 199 · SAMU 192
      </p>
    </div>
  )
}
