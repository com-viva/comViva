import type { EventoWeb } from '../services/eventosWeb'

interface Props {
  evento: EventoWeb
  onDetalhes: (id: number) => void
  onCancelar?: () => void
  cancelando?: boolean
}
const niveis: Record<string, string> = { INICIANTE: 'Iniciante', INTERMEDIARIO: 'Intermediário', AVANCADO: 'Avançado' }
export const formatarData = (data: string) => new Date(data).toLocaleDateString('pt-BR')
export const formatarHora = (data: string) => new Date(data).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})

export function EventoCard({ evento, onDetalhes, onCancelar, cancelando }: Props) {
  return (
    <article className="cv-card">
      <div className="cv-card__conteudo">
        <div className="cv-card__topo">
          <h2 className="cv-titulo-degrade">{evento.nome}</h2>
          <span className={`cv-nivel cv-nivel--${evento.nivel?.toLowerCase() || 'outro'}`}>
            ★ {niveis[evento.nivel] || evento.nivel}
          </span>
        </div>
        <p className="cv-card__descricao">{evento.descricao || 'Sem descrição disponível.'}</p>
        <div className="cv-card__metadados">
          <span>▦ {formatarData(evento.dataHora)}</span>
          <span>◷ {formatarHora(evento.dataHora)}</span>
        </div>
        <p className="cv-card__local">⌖ {evento.endereco}</p>
        <div className="cv-etiquetas">
          {evento.categoria != null && <span>{evento.categoria}</span>}
          {evento.subcategoria != null && <span>{evento.subcategoria}</span>}
        </div>
      </div>
      <div className="cv-card__acoes">
        <button type="button" className="cv-botao cv-botao--primario" onClick={() => onDetalhes(evento.id)}>Saber mais</button>
        {onCancelar && <button type="button" className="cv-botao cv-botao--contorno" onClick={onCancelar} disabled={cancelando}>{cancelando ? 'Cancelando...' : 'Cancelar inscrição'}</button>}
      </div>
    </article>
  )
}
