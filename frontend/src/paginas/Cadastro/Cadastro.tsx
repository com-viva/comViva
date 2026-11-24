
import { useState } from 'react'
import type { FormEvent } from 'react'
import './Cadastro.css'

interface CadastroProps {
    onVoltarLogin: () => void
}

export default function Cadastro({
    onVoltarLogin
}: CadastroProps) {

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [erro, setErro] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErro('')

        if (senha !== confirmarSenha) {
            setErro('As senhas informadas não coincidem.')
            return
        }

        if (senha.length < 6) {
            setErro('A senha deve possuir pelo menos 6 caracteres.')
            return
        }

        // integração com backend
        setErro('O envio do cadastro ainda não foi implementado.')
    }

    return (
        <main className="cadastro-page">
            <section className="cadastro-container">

                <header className="cadastro-header">
                    <img
                        src="/favicon.png"
                        alt="ComViva"
                        className="cadastro-logo"
                    />
                    <h1>Crie sua conta</h1>
                    <p>
                        Faça parte do ComViva e descubra novas experiências.
                    </p>
                </header>

                <form className="cadastro-form" onSubmit={handleSubmit}>

                    <div className="cadastro-field">
                        <label htmlFor="nome">Nome completo</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder="Digite seu nome"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="email-cadastro">E-mail</label>
                        <input
                            id="email-cadastro"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="telefone">Telefone</label>
                        <input
                            id="telefone"
                            type="tel"
                            value={telefone}
                            onChange={e => setTelefone(e.target.value)}
                            placeholder="(00) 00000-0000"
                            autoComplete="tel"
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="dataNascimento">
                            Data de nascimento
                        </label>
                        <input
                            id="dataNascimento"
                            type="date"
                            value={dataNascimento}
                            onChange={e => setDataNascimento(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="senha-cadastro">Senha</label>
                        <input
                            id="senha-cadastro"
                            type="password"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            placeholder="Mínimo de 6 caracteres"
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="confirmarSenha">
                            Confirmar senha
                        </label>
                        <input
                            id="confirmarSenha"
                            type="password"
                            value={confirmarSenha}
                            onChange={e => setConfirmarSenha(e.target.value)}
                            placeholder="Digite novamente sua senha"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {erro && (
                        <p className="cadastro-error" role="alert">
                            {erro}
                        </p>
                    )}

                    <button type="submit" className="cadastro-button">
                        Criar conta
                    </button>

                </form>

                <footer className="cadastro-footer">
                    <span>Já possui uma conta?</span>
                    <button type="button" onClick={onVoltarLogin}>
                        Entrar
                    </button>
                </footer>

            </section>
        </main>
    )
}
