import { useEffect, useState } from 'react'
import { EventoCard } from '../../componentes/EventoCard'
import { buscarEventoPorId, buscarInscricoes, cancelarInscricao } from '../../services/eventosWeb'
import type { EventoWeb } from '../../services/eventosWeb'

interface Props { token: string; onDetalhes: (id: number) => void; onSessaoExpirada: () => void }
interface Inscrito { inscricaoId: number; evento: EventoWeb }
export default function Inscricoes({ token, onDetalhes, onSessaoExpirada }: Props) {
  const [inscritos, setInscritos] = useState<Inscrito[]>([])
  const [pesquisa, setPesquisa] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    buscarInscricoes(token).then(dados => Promise.all(dados.filter(item => item.status === 'REALIZADA').map(async item => ({
      inscricaoId: item.id, evento: await buscarEventoPorId(item.eventoId, token)
    })))).then(lista => { if (ativo) setInscritos(lista) })
      .catch(e => { if (!ativo) return; const msg = e instanceof Error ? e.message : 'Erro ao carregar inscrições.'; if (msg.includes('Sessão inválida')) onSessaoExpirada(); else setErro(msg) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [token, recarregar, onSessaoExpirada])

  async function cancelar(id: number) {
    if (!window.confirm('Deseja cancelar esta inscrição?')) return
    setErro(''); setMensagem(''); setProcessando(id)
    try {
      await cancelarInscricao(id, token)
      setMensagem('Inscrição cancelada com sucesso.')
      setRecarregar(v => v + 1)
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível cancelar a inscrição.') }
    finally { setProcessando(null) }
  }
  const filtrados = inscritos.filter(item => item.evento.nome.toLocaleLowerCase('pt-BR').includes(pesquisa.trim().toLocaleLowerCase('pt-BR')))
  return (
    <section className="cv-pagina">
      <div className="cv-cabecalho-pagina"><div><p className="cv-sobretitulo">Sua agenda</p><h1>Minhas inscrições</h1><p>Veja os eventos que você pretende participar.</p></div></div>
      <div className="cv-filtros"><label className="cv-campo cv-campo--pesquisa">Pesquisar nas inscrições<input value={pesquisa} onChange={e => setPesquisa(e.target.value)} placeholder="Nome do evento" /></label></div>
      {mensagem && <p role="status" className="cv-alerta cv-alerta--sucesso">{mensagem}</p>}
      {erro && <p role="alert" className="cv-alerta cv-alerta--erro">{erro}</p>}
      {carregando ? <p className="cv-estado">Carregando inscrições...</p> : filtrados.length === 0 ? <p className="cv-estado">Você não possui inscrições ativas para essa pesquisa.</p> :
        <div className="cv-grade">{filtrados.map(item => <EventoCard key={item.inscricaoId} evento={item.evento} onDetalhes={onDetalhes} onCancelar={() => cancelar(item.inscricaoId)} cancelando={processando === item.inscricaoId} />)}</div>}
    </section>
  )
}
