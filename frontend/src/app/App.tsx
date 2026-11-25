import { useCallback, useState } from 'react'
import Login from '../paginas/Login/Login'
import Cadastro from '../paginas/Cadastro/Cadastro'
import Eventos from '../paginas/Eventos/Eventos'
import Inscricoes from '../paginas/Inscricoes/Inscricoes'
import DetalhesEvento from '../paginas/DetalhesEvento/DetalhesEvento'
import { login } from '../services/api'
import logo from '../assets/logoComViva-sn.png'
import './App.css'

type Aba = 'eventos' | 'inscricoes'
type Autenticacao = 'login' | 'cadastro'

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('comviva_token') || '')
  const [telaAutenticacao, setTelaAutenticacao] = useState<Autenticacao>('login')
  const [aba, setAba] = useState<Aba>('eventos')
  const [eventoId, setEventoId] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const sair = useCallback(() => {
    sessionStorage.removeItem('comviva_token')
    setToken('')
    setEventoId(null)
    setAba('eventos')
    setTelaAutenticacao('login')
  }, [])

  const sessaoExpirada = useCallback(() => {
    sair()
    setErro('Sua sessão expirou. Faça login novamente.')
  }, [sair])

  async function entrar(email: string, senha: string): Promise<void> {
    setErro('')
    setMensagem('')
    setCarregando(true)
    try {
      const resultado = await login(email, senha)
      sessionStorage.setItem('comviva_token', resultado.token)
      setToken(resultado.token)
    } catch {
      setErro('Não foi possível entrar. Verifique o e-mail e a senha.')
    } finally {
      setCarregando(false)
    }
  }

  if (!token) {
    if (telaAutenticacao === 'cadastro') {
      return <Cadastro
        onVoltarLogin={() => { setErro(''); setTelaAutenticacao('login') }}
        onCadastroSucesso={() => {
          setErro('')
          setMensagem('Conta criada com sucesso! Faça login para continuar.')
          setTelaAutenticacao('login')
        }}
      />
    }
    return <Login
      onLogin={entrar}
      onCriarConta={() => { setErro(''); setMensagem(''); setTelaAutenticacao('cadastro') }}
      carregando={carregando}
      erro={erro}
      mensagem={mensagem}
    />
  }

  function selecionarAba(proxima: Aba) {
    setEventoId(null)
    setAba(proxima)
  }

  return (
    <div className="cv-aplicacao">
      <header className="cv-header">
        <div className="cv-header__dentro">
          <div className="cv-identidade"><img src={logo} alt="ComViva"/><span>Conexões que transformam</span></div>
          <nav className="cv-navegacao" aria-label="Navegação principal">
            <button type="button" className={aba === 'eventos' ? 'ativo' : ''} aria-current={aba === 'eventos' ? 'page' : undefined} onClick={() => selecionarAba('eventos')}>Início</button>
            <button type="button" className={aba === 'inscricoes' ? 'ativo' : ''} aria-current={aba === 'inscricoes' ? 'page' : undefined} onClick={() => selecionarAba('inscricoes')}>Inscrições</button>
          </nav>
          <button type="button" className="cv-sair" onClick={sair}>Sair</button>
        </div>
      </header>
      <main className="cv-conteudo">
        {eventoId !== null ? <DetalhesEvento key={eventoId} token={token} id={eventoId} onVoltar={() => setEventoId(null)} onSessaoExpirada={sessaoExpirada} /> :
          aba === 'eventos' ? <Eventos token={token} onDetalhes={setEventoId} onSessaoExpirada={sessaoExpirada} /> :
          <Inscricoes token={token} onDetalhes={setEventoId} onSessaoExpirada={sessaoExpirada} />}
      </main>
      <nav className="cv-navegacao-mobile" aria-label="Navegação móvel">
        <button type="button" className={aba === 'eventos' ? 'ativo' : ''} onClick={() => selecionarAba('eventos')}><span aria-hidden="true">⌂</span>Início</button>
        <button type="button" className={aba === 'inscricoes' ? 'ativo' : ''} onClick={() => selecionarAba('inscricoes')}><span aria-hidden="true">▦</span>Inscrições</button>
      </nav>
    </div>
  )
}
