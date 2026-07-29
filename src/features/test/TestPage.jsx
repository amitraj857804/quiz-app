import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { startTest, submitTest, answerQuestion, nextQuestion, prevQuestion } from './testSlice'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function TestPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const selectedTopic = useAppSelector((s) => s.topics.selected)
  const { questions, currentIndex, answers, status, attemptId, error } = useAppSelector((s) => s.test)

  // Only fires from a genuinely fresh 'idle' state. A failure sets status to
  // 'failed' (see testSlice), never back to 'idle' — so this can never loop.
  useEffect(() => {
    if (selectedTopic && status === 'idle') {
      dispatch(startTest(selectedTopic.id ?? selectedTopic.name))
    }
  }, [selectedTopic, status, dispatch])

  useEffect(() => {
    if (status === 'done') navigate('/results')
  }, [status, navigate])

  if (!selectedTopic) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-paper-dim">No topic selected yet.</p>
        <Button className="mt-4" onClick={() => navigate('/topics')}>
          Choose a topic
        </Button>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="mb-2 text-paper">Couldn't build your {selectedTopic.name} quiz.</p>
        {error && <p className="mb-6 font-mono text-xs text-error">{error}</p>}
        <div className="flex justify-center gap-3">
          <Button onClick={() => dispatch(startTest(selectedTopic.id ?? selectedTopic.name))}>
            Try again
          </Button>
          <Button variant="secondary" onClick={() => navigate('/topics')}>
            Choose another topic
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'loading' || questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-mono text-sm text-paper-dim">Building your {selectedTopic.name} quiz…</p>
      </div>
    )
  }

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const selected = answers[question.id]

  function handleSelect(idx) {
    dispatch(answerQuestion({ questionId: question.id, selectedIndex: idx }))
  }

  function handleSubmit() {
    const payload = Object.entries(answers).map(([questionId, selectedIndex]) => ({
      questionId,
      selectedIndex,
    }))
    dispatch(submitTest({ attemptId, answers: payload }))
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* progress */}
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-gold">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="font-mono text-xs text-paper-dim">{selectedTopic.name}</span>
      </div>
      <div className="mb-10 h-1 w-full rounded-full bg-ink-800">
        <div
          className="h-1 rounded-full bg-gold transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="mb-6 font-display text-2xl leading-snug text-paper">{question.questionText}</h2>

          <div className="flex flex-col gap-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`rounded-sm border px-4 py-3 text-left transition-colors ${
                  selected === idx
                    ? 'border-gold bg-ink-800 text-paper'
                    : 'border-line text-paper-dim hover:border-paper-dim hover:text-paper'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-between">
        <Button variant="ghost" onClick={() => dispatch(prevQuestion())} disabled={currentIndex === 0}>
          Back
        </Button>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={status === 'submitting' || Object.keys(answers).length < questions.length}
          >
            {status === 'submitting' ? 'Grading…' : 'Submit test'}
          </Button>
        ) : (
          <Button onClick={() => dispatch(nextQuestion())} disabled={selected === undefined}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
