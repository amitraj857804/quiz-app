import { useDispatch, useSelector } from 'react-redux'

// Thin re-export so feature files import from one place.
// If this migrates to TypeScript later, this is the only file that changes.
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
