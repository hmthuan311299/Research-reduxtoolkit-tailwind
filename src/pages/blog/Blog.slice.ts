import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },

    cancelEditPost: (state) => {
      state.postId = ''
    }
  }
})
export const { startEditPost, cancelEditPost } = blogSlice.actions
export default blogSlice.reducer
