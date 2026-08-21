import { MessageSquare, ExternalLink } from 'lucide-react'

const OUVIDORIAS = {
  AC: 'https://www.ac.gov.br/ouvidoria',
  AL: 'https://www.ouvidoria.al.gov.br',
  AM: 'https://www.ouvidoria.am.gov.br',
  AP: 'https://www.portal.ap.gov.br/ouvidoria',
  BA: 'https://www.ouvidoriageral.ba.gov.br',
  CE: 'https://cearatransparente.ce.gov.br/portal-da-transparencia/ouvidoria',
  DF: 'https://www.ouvidoria.df.gov.br',
  ES: 'https://ouvidoria.es.gov.br',
  GO: 'https://www.cge.go.gov.br/ouvidoria',
  MA: 'https://www.ouvidoria.ma.gov.br',
  MG: 'https://www.ouvidoriageral.mg.gov.br',
  MS: 'https://www.controladoria.ms.gov.br/ouvidoria',
  MT: 'https://www.ouvidoria.mt.gov.br',
  PA: 'https://www.ouvidoria.pa.gov.br',
  PB: 'https://www.controladoria.pb.gov.br/ouvidoria',
  PE: 'https://www.ouvidoria.pe.gov.br',
  PI: 'https://www.cge.pi.gov.br/ouvidoria',
  PR: 'https://www.cge.pr.gov.br/Pagina/Ouvidoria-Geral-do-Estado',
  RJ: 'https://www.ouvidoria.rj.gov.br',
  RN: 'https://www.control.rn.gov.br/ouvidoria',
  RO: 'https://ouvidoria.ro.gov.br',
  RR: 'https://www.cge.rr.gov.br/ouvidoria',
  RS: 'https://www.cge.rs.gov.br/ouvidoria',
  SC: 'https://www.ouvidoria.sc.gov.br',
  SE: 'https://www.ouvidoria.se.gov.br',
  SP: 'https://www.ouvidoria.sp.gov.br',
  TO: 'https://www.cge.to.gov.br/ouvidoria',
}

export default function OuvidoriaLink({ uf, nome }) {
  const url = OUVIDORIAS[uf] || `https://www.google.com/search?q=ouvidoria+governo+${nome}`

  return (
    <div className="card" style={{ padding: '20px 24px', borderLeft: '4px solid #7C3AED' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MessageSquare size={18} style={{ color: '#7C3AED' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            Cobre ações do seu governo
          </h3>
          <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 12 }}>
            Se os dados do Farol Clima mostram que {nome} precisa melhorar, você pode enviar uma manifestação pela Ouvidoria do estado. É um direito de todo cidadão cobrar ações climáticas.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 8,
              background: '#7C3AED', color: 'white',
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Acessar Ouvidoria de {uf}
            <ExternalLink size={13} />
          </a>
          <p style={{ fontSize: 10, color: '#ccc', marginTop: 8 }}>
            Ouvidoria Geral do Estado · Portal oficial do governo
          </p>
        </div>
      </div>
    </div>
  )
}
