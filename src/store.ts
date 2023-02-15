import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import blogSlice from './pages/blog/blog.slice'

const store = configureStore({
  reducer: {
    blog: blogSlice
  }
})
export default store

// get RootState và AppDispatch từ store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
