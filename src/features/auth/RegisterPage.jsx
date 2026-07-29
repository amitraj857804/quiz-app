import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { register } from './authSlice'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector((s) => s.auth)

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await dispatch(register({ name, email, password }))
    if (register.fulfilled.match(result)) navigate('/topics')
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-gold">Get started</p>
        <h1 className="mb-8 font-display text-3xl text-paper">Create your account</h1>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-paper-dim">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-sm border border-line bg-ink-950 px-3 py-2 text-paper outline-none focus:border-gold"
                placeholder="Ada Lovelace"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-paper-dim">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-sm border border-line bg-ink-950 px-3 py-2 text-paper outline-none focus:border-gold"
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-paper-dim">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-sm border border-line bg-ink-950 px-3 py-2 text-paper outline-none focus:border-gold"
                placeholder="At least 8 characters"
              />
            </label>

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="submit" disabled={status === 'loading'} className="mt-2 w-full">
              {status === 'loading' ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-paper-dim">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
