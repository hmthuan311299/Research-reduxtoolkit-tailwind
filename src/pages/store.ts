import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './blog/blog.reducer'

const store = configureStore({
  reducer: {
    blog: blogReducer
  }
})
export default store

// get RootState và AppDispatch từ store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
