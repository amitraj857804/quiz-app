import { Link, useNavigate } from 'react-router-dom'
import { Stamp, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import Button from './Button'

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-paper">
          <Stamp size={20} className="text-gold" strokeWidth={1.5} />
          <span className="font-display text-lg tracking-tight">Marked</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs text-paper-dim sm:inline">{user.name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut size={16} />
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button as={Link} to="/login" variant="ghost">
              Log in
            </Button>
            <Button as={Link} to="/register" variant="primary">
              Get started
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
