import { useEffect, useState } from 'react'
import { formatarData, formatarHora } from '../../componentes/EventoCard'
import { buscarEventoPorId, buscarInscricoes, cancelarInscricao, criarInscricao } from '../../services/eventosWeb'
import type { EventoWeb } from '../../services/eventosWeb'

interface Props { token: string; id: number; onVoltar: () => void; onSessaoExpirada: () => void }
export default function DetalhesEvento({ token, id, onVoltar, onSessaoExpirada }: Props) {
  const [evento, setEvento] = useState<EventoWeb | null>(null)
  const [inscricaoId, setInscricaoId] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [atualizar, setAtualizar] = useState(0)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    Promise.all([buscarEventoPorId(id, token), buscarInscricoes(token)])
      .then(([dados, inscricoes]) => {
        if (!ativo) return
        setEvento(dados)
        setInscricaoId(inscricoes.find(item => item.eventoId === id && item.status === 'REALIZADA')?.id ?? null)
      })
      .catch(e => { if (!ativo) return; const msg = e instanceof Error ? e.message : 'Não foi possível carregar o evento.'; if (msg.includes('Sessão inválida')) onSessaoExpirada(); else setErro(msg) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [token, id, atualizar, onSessaoExpirada])

  async function alternarInscricao() {
    if (!evento) return
    setProcessando(true); setErro(''); setMensagem('')
    try {
      if (inscricaoId !== null) {
        if (!window.confirm('Cancelar sua inscrição neste evento?')) return
        await cancelarInscricao(inscricaoId, token)
        setMensagem('Inscrição cancelada com sucesso.')
      } else {
        await criarInscricao(evento.id, token)
        setMensagem('Inscrição realizada com sucesso!')
      }
      setAtualizar(n => n + 1)
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível processar sua inscrição.') }
    finally { setProcessando(false) }
  }
  return (
    <section className="cv-pagina cv-detalhes">
      <button type="button" className="cv-link" onClick={onVoltar}>← Voltar aos eventos</button>
      {erro && <p role="alert" className="cv-alerta cv-alerta--erro">{erro}</p>}
      {mensagem && <p role="status" className="cv-alerta cv-alerta--sucesso">{mensagem}</p>}
      {carregando ? <p className="cv-estado">Carregando detalhes...</p> : !evento ? <p className="cv-estado">Evento indisponível.</p> : <>
        <h1 className="cv-titulo-degrade">{evento.nome}</h1>
        <div className="cv-detalhes__conteudo">
          <section className="cv-painel"><h2>Sobre o evento</h2><div className="cv-linha-degrade"/><p>{evento.descricao || 'Descrição não disponível.'}</p></section>
          <section className="cv-painel"><h2>Informações</h2><div className="cv-linha-degrade"/>
            <dl className="cv-informacoes">
              <div><dt>⌖ Local</dt><dd>{evento.endereco}</dd></div>
              <div><dt>▦ Data</dt><dd>{formatarData(evento.dataHora)}</dd></div>
              <div><dt>◷ Horário</dt><dd>{formatarHora(evento.dataHora)} às {formatarHora(evento.dataHoraFim)}</dd></div>
              <div><dt>★ Nível</dt><dd>{evento.nivel}</dd></div>
              <div><dt>Categoria</dt><dd>{evento.categoria ?? 'Não informada'}</dd></div>
              {evento.subcategoria != null && <div><dt>Subcategoria</dt><dd>{evento.subcategoria}</dd></div>}
              <div><dt>Participantes</dt><dd>{evento.qntdInscritos ?? '—'} / {evento.capacidadeMax}</dd></div>
            </dl>
            <button type="button" className={`cv-botao ${inscricaoId === null ? 'cv-botao--primario' : 'cv-botao--contorno'}`} disabled={processando || (inscricaoId === null && evento.status !== 'AGENDADO')} onClick={alternarInscricao}>
              {processando ? 'Aguarde...' : inscricaoId !== null ? 'Cancelar inscrição' : evento.status === 'AGENDADO' ? 'Quero me inscrever' : 'Inscrição indisponível'}
            </button>
          </section>
        </div>
      </>}
    </section>
  )
}
