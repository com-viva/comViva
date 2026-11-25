
import { useState } from 'react'
import type { FormEvent } from 'react'
import './CriarEvento.css'

export default function CriarEvento() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [endereco, setEndereco] = useState('')
  const [nivel, setNivel] = useState('')
  const [capacidadeMin, setCapacidadeMin] = useState('')
  const [capacidadeMax, setCapacidadeMax] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <main className="criar-evento-page">
      <header className="criar-evento-header">
        <span className="criar-evento-destaque">
          COMPARTILHE EXPERIÊNCIAS
        </span>
        <h1>Criar evento</h1>
        <p>
          Organize uma atividade e conecte pessoas
          por meio de novas experiências.
        </p>
      </header>

      <form className="criar-evento-form" onSubmit={handleSubmit}>
        <section className="criar-evento-card">
          <h2>Informações do evento</h2>

          <div className="criar-evento-campo">
            <label htmlFor="nomeEvento">Nome do evento</label>
            <input
              id="nomeEvento"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex.: Oficina de pintura"
              required
            />
          </div>

          <div className="criar-evento-campo">
            <label htmlFor="descricaoEvento">Descrição</label>
            <textarea
              id="descricaoEvento"
              rows={5}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Conte um pouco sobre a atividade..."
              required
            />
            <p className="criar-evento-ajuda">
              Posteriormente, você poderá gerar uma sugestão
              de descrição utilizando IA.
            </p>
          </div>

          <div className="criar-evento-grid">
            <div className="criar-evento-campo">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={e => {
                  setCategoriaId(e.target.value)
                  setSubcategoriaId('')
                }}
                required
              >
                <option value="">Selecione uma categoria</option>
              </select>
            </div>

            <div className="criar-evento-campo">
              <label htmlFor="subcategoria">
                Subcategoria (opcional)
              </label>
              <select
                id="subcategoria"
                value={subcategoriaId}
                onChange={e => setSubcategoriaId(e.target.value)}
                disabled={!categoriaId}
              >
                <option value="">Sem subcategoria</option>
              </select>
            </div>
          </div>
        </section>

        <section className="criar-evento-card">
          <h2>Data e local</h2>

          <div className="criar-evento-campo">
            <label htmlFor="dataHora">Data e horário</label>
            <input
              id="dataHora"
              type="datetime-local"
              value={dataHora}
              onChange={e => setDataHora(e.target.value)}
              required
            />
          </div>

          <div className="criar-evento-campo">
            <label htmlFor="endereco">Local do evento</label>
            <input
              id="endereco"
              value={endereco}
              onChange={e => setEndereco(e.target.value)}
              placeholder="Informe o endereço da atividade"
              required
            />
          </div>
        </section>

        <section className="criar-evento-card">
          <h2>Participantes</h2>

          <div className="criar-evento-grid">
            <div className="criar-evento-campo">
              <label htmlFor="capacidadeMin">
                Mínimo de participantes
              </label>
              <input
                id="capacidadeMin"
                type="number"
                min="1"
                value={capacidadeMin}
                onChange={e => setCapacidadeMin(e.target.value)}
                required
              />
            </div>

            <div className="criar-evento-campo">
              <label htmlFor="capacidadeMax">
                Máximo de participantes
              </label>
              <input
                id="capacidadeMax"
                type="number"
                min="1"
                value={capacidadeMax}
                onChange={e => setCapacidadeMax(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="criar-evento-campo">
            <label htmlFor="nivel">Nível da atividade</label>
            <select
              id="nivel"
              value={nivel}
              onChange={e => setNivel(e.target.value)}
              required
            >
              <option value="">Selecione o nível</option>
              <option value="INICIANTE">Iniciante</option>
              <option value="INTERMEDIARIO">Intermediário</option>
              <option value="AVANCADO">Avançado</option>
            </select>
          </div>
        </section>

        <div className="criar-evento-acoes">
          <p>
            O formulário está em preparação.
            A publicação será habilitada após a integração.
          </p>
          <button type="submit" disabled>
            Publicar evento
          </button>
        </div>
      </form>
    </main>
  )
}
