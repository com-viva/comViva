import { useEffect, useState } from 'react'
import { detalharEvento, inscreverEvento, listarEventos, login } from '../services/api'
import type { Evento } from '../services/api'
import './App.css'
import Login from '../paginas/Login/Login'
import Cadastro from '../paginas/Cadastro/Cadastro'

function formatarData(data: string) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('comviva_token') || '')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selecionado, setSelecionado] = useState<Evento | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [telaAutenticacao, setTelaAutenticacao] = useState<'login' | 'cadastro'>('login')

  useEffect(() => {
    if (!token) return
    let ativo = true
    listarEventos(token)
      .then(dados => { if (ativo) setEventos(dados) })
      .catch(e => {
        if (!ativo) return
        if (e instanceof Error && e.message.includes('Sessão inválida')) {
          sessionStorage.removeItem('comviva_token')
          setToken('')
          setErro('Sua sessão expirou. Faça login novamente.')
        } else {
          setErro(e instanceof Error ? e.message : 'Erro ao carregar eventos')
        }
      })
    return () => { ativo = false }
  }, [token])

 
async function entrar(email: string, senha: string): Promise<void> {
  setErro('')
  setMensagem('')
  setCarregando(true)

  try {
    const resposta = await login(email, senha)

    sessionStorage.setItem('comviva_token', resposta.token)
    setToken(resposta.token)
  } catch {
    setErro('Não foi possível entrar. Verifique o e-mail e a senha.')
  } finally {
    setCarregando(false)
  }
}


  function sair() {
    sessionStorage.removeItem('comviva_token')
    setToken('')
    setEventos([])
    setSelecionado(null)
    setMensagem('')
    setErro('')
  }

  async function abrirEvento(id: number) {
    setErro('')
    setMensagem('')
    try { setSelecionado(await detalharEvento(id, token)) }
    catch { setErro('Não foi possível consultar os detalhes do evento.') }
  }

  async function inscrever() {
    if (!selecionado) return
    setErro('')
    setMensagem('')
    setCarregando(true)
    try {
      await inscreverEvento(selecionado.id, token)
      setMensagem('Inscrição realizada com sucesso!')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível realizar a inscrição.')
    } finally {
      setCarregando(false)
    }
  }


if (!token) {
  if (telaAutenticacao === 'cadastro') {
    return (
      <Cadastro
        onVoltarLogin={() => {
          setErro('')
          setTelaAutenticacao('login')
        }}
      />
    )
  }

  return (
    <Login
      onLogin={entrar}
      onCriarConta={() => {
        setErro('')
        setTelaAutenticacao('cadastro')
      }}
      carregando={carregando}
      erro={erro}
    />
  )
}

}

export default App
