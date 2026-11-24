const API_BASE = '/api'

export interface Evento {
  id: number
  nome: string
  descricao: string | null
  dataHora: string
  dataHoraFim: string
  capacidadeMin: number
  capacidadeMax: number
  endereco: string
  status: string
  nivel: string
  categoriaId: number
  subcategoriaId: number | null
  usuarioId: number
}

export interface LoginResponse {
  token: string
  tipo: string
}

export async function requisicao<T>(
  caminho: string,
  opcoes: RequestInit = {},
  token?: string,
): Promise<T> {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    ...opcoes,
    headers: {
      ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  })

  if (!resposta.ok) {
    const tipo = resposta.headers.get('content-type') || ''
    const erro = tipo.includes('application/json')
      ? JSON.stringify(await resposta.json())
      : await resposta.text()
    if (resposta.status === 401) throw new Error('Sessão inválida ou expirada. Faça login novamente.')
    throw new Error(erro || `Erro HTTP ${resposta.status}`)
  }

  if (resposta.status === 204) return undefined as T
  return resposta.json() as Promise<T>
}

export function login(email: string, senha: string) {
  return requisicao<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
}

export function listarEventos(token: string) {
  return requisicao<Evento[]>('/eventos', {}, token)
}

export function detalharEvento(id: number, token: string) {
  return requisicao<Evento>(`/eventos/${id}`, {}, token)
}

export function inscreverEvento(id: number, token: string) {
  return requisicao<void>(`/inscricoes/evento/${id}`, { method: 'POST' }, token)
}
