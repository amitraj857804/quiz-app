import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { searchTopics, selectTopic } from './topicsSlice'
import Card from '../../components/Card'
import Button from '../../components/Button'

// Shown before the user has typed anything — nudges them toward common subjects.
const SUGGESTED = ['Data Structures', 'Photosynthesis', 'World War II', 'SQL Joins', 'Thermodynamics']

export default function TopicSelectPage() {
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { results, status } = useAppSelector((s) => s.topics)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length > 1) dispatch(searchTopics(query.trim()))
    }, 350)
    return () => clearTimeout(timeout)
  }, [query, dispatch])

  function handlePick(name) {
    dispatch(selectTopic({ name }))
    navigate('/test')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-gold">Step 1 of 3</p>
        <h1 className="mb-2 font-display text-3xl text-paper">What do you want to be tested on?</h1>
        <p className="mb-8 text-paper-dim">Type any topic — we'll build a quiz for it, even if it's the first time.</p>

        <Card>
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <Search size={18} className="text-paper-dim" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Recursion, French Revolution, Ohm's Law…"
              className="w-full bg-transparent text-paper outline-none placeholder:text-paper-dim"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(query.trim().length > 1 ? results.map((r) => r.name) : SUGGESTED).map((name) => (
              <button
                key={name}
                onClick={() => handlePick(name)}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-paper-dim transition-colors hover:border-gold hover:text-paper"
              >
                {name}
              </button>
            ))}
            {status === 'loading' && <span className="text-sm text-paper-dim">Searching…</span>}
          </div>

          {query.trim().length > 1 && (
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => handlePick(query.trim())}
            >
              Use "{query.trim()}"
              <ArrowRight size={16} />
            </Button>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
