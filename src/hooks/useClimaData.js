import { useState, useEffect } from 'react'

export function useClimaData() {
  const [estados, setEstados] = useState([])
  const [capitais, setCapitais] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [resE, resC] = await Promise.all([
          fetch('/data/painel-estados.json'),
          fetch('/data/painel-capitais.json'),
        ])
        setEstados(await resE.json())
        setCapitais(await resC.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const todos = [...estados, ...capitais]

  function buscarEnte(id) {
    return todos.find(e => e.uf === id || e.nome === id)
  }

  return { estados, capitais, todos, loading, error, buscarEnte }
}
