import { configureStore } from '@reduxjs/toolkit'
import blogSlice from './blog/blog.slice'

const store = configureStore({
  reducer: {
    blog: blogSlice
  }
})
export default store

// get RootState và AppDispatch từ store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
