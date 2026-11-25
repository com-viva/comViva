import type { ReactNode } from 'react'
import './Home.css'

interface HomeProps {
  children: ReactNode
}

export default function Home({ children }: HomeProps) {
  return (
    <div className="home-page">
      <section className="home-boas-vindas" aria-labelledby="home-titulo">
        <p className="home-destaque">DESCUBRA E PARTICIPE</p>
        <h1 id="home-titulo">Encontre sua próxima experiência</h1>
        <p className="home-descricao">
          Conecte-se com pessoas, explore atividades e viva novos momentos.
        </p>
      </section>

      <section className="home-conteudo" aria-label="Pesquisa e eventos disponíveis">
        {children}
      </section>
    </div>
  )
}
