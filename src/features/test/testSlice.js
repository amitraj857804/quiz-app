import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const startTest = createAsyncThunk('test/start', async (topicId) => {
  return api.post('/tests/start', { topicId })
  // expected: { attemptId, questions: [{ id, questionText, options, subtopic }] }
})

export const submitTest = createAsyncThunk('test/submit', async ({ attemptId, answers }) => {
  return api.post('/tests/submit', { attemptId, answers })
  // expected: { score, passed, totalQuestions, weakSubtopics: [...], resources: [...] }
})

const testSlice = createSlice({
  name: 'test',
  initialState: {
    attemptId: null,
    questions: [],
    currentIndex: 0,
    answers: {}, // { questionId: selectedIndex }
    result: null,
    status: 'idle', // idle | loading | in-progress | submitting | done | failed
    error: null,
  },
  reducers: {
    answerQuestion(state, action) {
      const { questionId, selectedIndex } = action.payload
      state.answers[questionId] = selectedIndex
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) state.currentIndex += 1
    },
    prevQuestion(state) {
      if (state.currentIndex > 0) state.currentIndex -= 1
    },
    resetTest(state) {
      state.attemptId = null
      state.questions = []
      state.currentIndex = 0
      state.answers = {}
      state.result = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTest.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(startTest.fulfilled, (state, action) => {
        state.status = 'in-progress'
        state.attemptId = action.payload.attemptId
        state.questions = action.payload.questions
        state.currentIndex = 0
        state.answers = {}
      })
      .addCase(startTest.rejected, (state, action) => {
        // IMPORTANT: this must NOT go back to 'idle' — TestPage's effect
        // auto-starts a test whenever status is 'idle', so resetting here
        // would immediately re-trigger another call, forever, on every failure.
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(submitTest.pending, (state) => {
        state.status = 'submitting'
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.status = 'done'
        state.result = action.payload
      })
      .addCase(submitTest.rejected, (state) => {
        state.status = 'in-progress'
      })
  },
})

export const { answerQuestion, nextQuestion, prevQuestion, resetTest } = testSlice.actions
export default testSlice.reducer
