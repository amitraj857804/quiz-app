import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import topicsReducer from '../features/topics/topicsSlice'
import testReducer from '../features/test/testSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicsReducer,
    test: testReducer,
  },
})
