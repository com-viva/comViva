import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  buscarCategorias,
  buscarSubcategorias
} from '../../services/eventosWeb'
import type {
  Categoria,
  Subcategoria
} from '../../services/eventosWeb'
import './CriarEvento.css'

interface CriarEventoProps {
  token: string
}

export default function CriarEvento({ token }: CriarEventoProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [endereco, setEndereco] = useState('')
  const [nivel, setNivel] = useState('')
  const [capacidadeMin, setCapacidadeMin] = useState('')
  const [capacidadeMax, setCapacidadeMax] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])

  const [carregandoCategorias, setCarregandoCategorias] = useState(true)
  const [carregandoSubcategorias, setCarregandoSubcategorias] = useState(false)

  const [erroCategorias, setErroCategorias] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarCategorias() {
      setCarregandoCategorias(true)
      setErroCategorias('')

      try {
        const dados = await buscarCategorias(token)

        if (ativo) {
          setCategorias(dados)
        }
      } catch (error) {
        if (ativo) {
          console.error('Erro ao buscar categorias:', error)
          setErroCategorias(
            'Não foi possível carregar as categorias.'
          )
        }
      } finally {
        if (ativo) {
          setCarregandoCategorias(false)
        }
      }
    }

    carregarCategorias()

    return () => {
      ativo = false
    }
  }, [token])

  useEffect(() => {
    let ativo = true

    setSubcategorias([])

    if (!categoriaId) {
      setCarregandoSubcategorias(false)
      return () => {
        ativo = false
      }
    }

    async function carregarSubcategorias() {
      setCarregandoSubcategorias(true)
      setErroCategorias('')

      try {
        const dados = await buscarSubcategorias(
          Number(categoriaId),
          token
        )

        if (ativo) {
          setSubcategorias(dados)
        }
      } catch (error) {
        if (ativo) {
          console.error('Erro ao buscar subcategorias:', error)
          setErroCategorias(
            'Não foi possível carregar as subcategorias.'
          )
        }
      } finally {
        if (ativo) {
          setCarregandoSubcategorias(false)
        }
      }
    }

    carregarSubcategorias()

    return () => {
      ativo = false
    }
  }, [categoriaId, token])

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
              type="text"
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
                disabled={carregandoCategorias}
                required
              >
                <option value="">
                  {carregandoCategorias
                    ? 'Carregando categorias...'
                    : 'Selecione uma categoria'}
                </option>

                {categorias.map(categoria => (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nome}
                  </option>
                ))}
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
                disabled={
                  !categoriaId || carregandoSubcategorias
                }
              >
                <option value="">
                  {carregandoSubcategorias
                    ? 'Carregando subcategorias...'
                    : 'Sem subcategoria'}
                </option>

                {subcategorias.map(subcategoria => (
                  <option
                    key={subcategoria.id}
                    value={subcategoria.id}
                  >
                    {subcategoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {erroCategorias && (
            <p className="criar-evento-erro" role="alert">
              {erroCategorias}
            </p>
          )}
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
              type="text"
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
            
          </p>

          <button type="submit" disabled>
            Publicar evento
          </button>
        </div>
      </form>
    </main>
  )
}
