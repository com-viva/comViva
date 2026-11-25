import { useState } from 'react'
import type { FormEvent } from 'react'
import './Login.css'

interface LoginProps {
  onLogin: (email: string, senha: string) => Promise<void>
  onCriarConta: () => void
  carregando: boolean
  erro: string
  mensagem: string
}

export default function Login({
  onLogin,
  onCriarConta,
  carregando,
  erro,
  mensagem
}: LoginProps) {

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onLogin(email, senha)
  }

  return (
    <main className="login-page">
      <section className="login-container">

        <header className="login-header">
          <img
            src="/favicon.png"
            alt="ComViva"
            className="login-logo"
          />

          <h1>Bem-vindo ao ComViva</h1>

          <p>
            Conecte-se para viver e compartilhar experiências.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="button"
            className="forgot-password"
            disabled={carregando}
          >
            Esqueceu sua senha?
          </button>

          {erro && <p role="alert" className="login-error">{erro}</p>}

{mensagem && (
  <p className="login-success" role="status">
    {mensagem}
  </p>
)}
          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <footer className="login-footer">
          <span>Ainda não tem uma conta?</span>

          <button
            type="button"
            className="register-button"
            onClick={onCriarConta}
          >
            Criar conta
          </button>
        </footer>

      </section>
    </main>
  )
}
