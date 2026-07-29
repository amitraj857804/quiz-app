import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlayCircle, ExternalLink } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetTest } from '../test/testSlice'
import MasterySeal from '../../components/MasterySeal'
import Card from '../../components/Card'
import Button from '../../components/Button'

const PASS_THRESHOLD = 90

export default function ResultsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const result = useAppSelector((s) => s.test.result)
  const selectedTopic = useAppSelector((s) => s.topics.selected)

  if (!result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-paper-dim">No results yet — take a test first.</p>
        <Button className="mt-4" onClick={() => navigate('/topics')}>
          Choose a topic
        </Button>
      </div>
    )
  }

  const { score, passed, weakSubtopics = [], resources = [] } = result

  function handleRetry() {
    dispatch(resetTest())
    navigate('/test')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center text-center"
      >
        <MasterySeal percent={score} passed={passed} label={passed ? 'Passed' : 'Try again'} size={180} />

        <h1 className="mt-6 font-display text-3xl text-paper">
          {passed ? `You've mastered ${selectedTopic?.name}` : `Not quite there yet`}
        </h1>
        <p className="mt-2 max-w-md text-paper-dim">
          {passed
            ? `You scored ${score}% — above the ${PASS_THRESHOLD}% mark needed to pass.`
            : `You scored ${score}%. You need ${PASS_THRESHOLD}% to pass — here's what to review before your next attempt.`}
        </p>
      </motion.div>

      {!passed && weakSubtopics.length > 0 && (
        <Card className="mt-10">
          <h2 className="mb-4 font-display text-lg text-paper">Focus areas</h2>
          <div className="flex flex-col gap-4">
            {weakSubtopics.map((w) => (
              <div key={w.subtopic} className="border-b border-line pb-4 last:border-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-paper">{w.subtopic}</span>
                  <span className="font-mono text-xs text-error">{w.accuracy}% correct</span>
                </div>
                <div className="flex flex-col gap-2">
                  {resources
                    .filter((r) => r.subtopic === w.subtopic)
                    .map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-gold hover:underline"
                      >
                        <PlayCircle size={14} />
                        {r.title}
                        <ExternalLink size={12} className="opacity-60" />
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-10 flex justify-center gap-3">
        {!passed && <Button onClick={handleRetry}>Resume test</Button>}
        <Button variant="secondary" onClick={() => navigate('/topics')}>
          Choose another topic
        </Button>
      </div>
    </div>
  )
}
