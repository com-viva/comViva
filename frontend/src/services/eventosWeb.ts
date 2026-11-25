export interface EventoWeb {
  id: number
  nome: string
  descricao: string | null
  endereco: string
  dataHora: string
  dataHoraFim: string
  status: string
  nivel: string
  categoria?: string | number
  subcategoria?: string | number | null
  categoriaId?: number
  subcategoriaId?: number | null
  capacidadeMax: number
  qntdInscritos?: number
  usuarioId?: number
}

export interface Categoria { id: number; nome: string }
export interface Subcategoria { id: number; nome: string; categoriaId: number }
export interface Inscricao { id: number; status: 'REALIZADA' | 'CANCELADA'; eventoId: number; usuarioId: number }
export interface FiltrosEvento { nome?: string; categoriaId?: number; subcategoriaId?: number }

async function chamada<T>(caminho: string, token: string, init: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  })
  if (!resposta.ok) {
    if (resposta.status === 401) throw new Error('Sessão inválida ou expirada. Faça login novamente.')
    const tipo = resposta.headers.get('content-type') || ''
    let mensagem = `Erro HTTP ${resposta.status}`
    if (tipo.includes('application/json')) {
      const json: unknown = await resposta.json()
      if (typeof json === 'object' && json !== null && 'message' in json && typeof json.message === 'string') {
        mensagem = json.message
      }
    } else {
      mensagem = (await resposta.text()) || mensagem
    }
    throw new Error(mensagem)
  }
  if (resposta.status === 204) return undefined as T
  return resposta.json() as Promise<T>
}

export async function buscarEventos(token: string, filtros: FiltrosEvento = {}) {
  const params = new URLSearchParams()
  if (filtros.nome) params.set('nome', filtros.nome)
  if (filtros.categoriaId != null) params.set('categoriaId', String(filtros.categoriaId))
  if (filtros.subcategoriaId != null) params.set('subcategoriaId', String(filtros.subcategoriaId))
  const query = params.toString()
  return chamada<EventoWeb[]>(`/eventos${query ? `?${query}` : ''}`, token)
}
export const buscarEventoPorId = (id: number, token: string) => chamada<EventoWeb>(`/eventos/${id}`, token)
export const buscarCategorias = (token: string) => chamada<Categoria[]>('/categorias', token)
export const buscarSubcategorias = (categoriaId: number, token: string) => chamada<Subcategoria[]>(`/subcategorias/categoria/${categoriaId}`, token)
export const buscarInscricoes = (token: string) => chamada<Inscricao[]>('/inscricoes/usuario', token)
export const criarInscricao = (eventoId: number, token: string) => chamada<void>(`/inscricoes/evento/${eventoId}`, token, { method: 'POST' })
export const cancelarInscricao = (id: number, token: string) => chamada<void>(`/inscricoes/${id}`, token, { method: 'PATCH' })
