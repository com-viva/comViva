import { useEffect, useState } from 'react'
import { EventoCard } from '../../componentes/EventoCard'
import { buscarCategorias, buscarEventos, buscarSubcategorias } from '../../services/eventosWeb'
import type { Categoria, EventoWeb, Subcategoria } from '../../services/eventosWeb'

interface Props { token: string; onDetalhes: (id: number) => void; onSessaoExpirada: () => void }
export default function Eventos({ token, onDetalhes, onSessaoExpirada }: Props) {
  const [pesquisa, setPesquisa] = useState('')
  const [pesquisaAplicada, setPesquisaAplicada] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const [subcategoriaId, setSubcategoriaId] = useState<number | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [eventos, setEventos] = useState<EventoWeb[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setPesquisaAplicada(pesquisa.trim()), 500)
    return () => clearTimeout(timer)
  }, [pesquisa])
  useEffect(() => {
    let ativo = true
    buscarCategorias(token).then(dados => { if (ativo) setCategorias(dados) }).catch(() => { /* filtro indisponível não impede a listagem */ })
    return () => { ativo = false }
  }, [token])
  useEffect(() => {
    let ativo = true
    if (categoriaId == null) { setSubcategorias([]); return }
    buscarSubcategorias(categoriaId, token).then(dados => { if (ativo) setSubcategorias(dados) }).catch(() => { if (ativo) setSubcategorias([]) })
    return () => { ativo = false }
  }, [categoriaId, token])
  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    buscarEventos(token, {
      nome: pesquisaAplicada || undefined,
      categoriaId: categoriaId ?? undefined,
      subcategoriaId: subcategoriaId ?? undefined,
    }).then(dados => { if (ativo) setEventos(dados) })
      .catch(e => {
        if (!ativo) return
        const mensagem = e instanceof Error ? e.message : 'Não foi possível carregar eventos.'
        if (mensagem.includes('Sessão inválida')) onSessaoExpirada()
        else setErro(mensagem)
      })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [token, pesquisaAplicada, categoriaId, subcategoriaId, recarregar, onSessaoExpirada])

  return (
    <section className="cv-pagina">
      <div className="cv-filtros">
        <label className="cv-campo cv-campo--pesquisa">Pesquisar evento
          <input value={pesquisa} onChange={e => setPesquisa(e.target.value)} placeholder="Digite o nome de um evento" />
        </label>
        <label className="cv-campo">Categoria
          <select value={categoriaId ?? ''} onChange={e => { setCategoriaId(e.target.value ? Number(e.target.value) : null); setSubcategoriaId(null) }}>
            <option value="">Todas as categorias</option>
            {categorias.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
        {categoriaId != null && <label className="cv-campo">Subcategoria
          <select value={subcategoriaId ?? ''} onChange={e => setSubcategoriaId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Todas as subcategorias</option>
            {subcategorias.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>}
      </div>
      <div className="cv-resultado"><h2>Eventos disponíveis</h2><button className="cv-link" type="button" onClick={() => setRecarregar(n => n + 1)}>Atualizar</button></div>
      {erro && <p className="cv-alerta cv-alerta--erro" role="alert">{erro}</p>}
      {carregando ? <p className="cv-estado">Carregando eventos...</p> : eventos.length === 0 ? <p className="cv-estado">Nenhum evento encontrado.</p> :
        <div className="cv-grade">{eventos.map(item => <EventoCard key={item.id} evento={item} onDetalhes={onDetalhes} />)}</div>}
    </section>
  )
}
