import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/api'

export const searchTopics = createAsyncThunk('topics/search', async (query) => {
  return api.get(`/topics/search?q=${encodeURIComponent(query)}`)
  // expected: [{ id, name }]
})

const topicsSlice = createSlice({
  name: 'topics',
  initialState: {
    results: [],
    selected: null,
    status: 'idle',
  },
  reducers: {
    selectTopic(state, action) {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTopics.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(searchTopics.fulfilled, (state, action) => {
        state.status = 'idle'
        state.results = action.payload
      })
      .addCase(searchTopics.rejected, (state) => {
        state.status = 'failed'
        state.results = []
      })
  },
})

export const { selectTopic } = topicsSlice.actions
export default topicsSlice.reducer
