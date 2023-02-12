import { createAction, createReducer, current, nanoid } from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'
import { IPost } from 'types/blog.type'

interface IBlogState {
  postList: IPost[]
  editingPost: IPost | null
}

//createAction
//<IPost> GenericType: quy định kiểu dữ liệu truyền vào func
export const addPost = createAction('blog/addPost', (post: Omit<IPost, 'id'>) => {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  }
})
export const deletePost = createAction<String>('blog/deletePost')
export const startEditingPost = createAction<String>('blog/startEditingPost')
export const cancelEditingPost = createAction('blog/cancelEditingPost')
export const finishEditingPost = createAction<IPost>('/blog/finishEditingPost')

const initalState: IBlogState = {
  postList: initalPostList,
  editingPost: null
}
const blogReducer = createReducer(initalState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      // immerjs
      // immerjs giúp chúng ta mutate một state an toàn
      state.postList.push(action.payload)
    })
    .addCase(deletePost, (state, action) => {
      const postId = action.payload
      const foundPostIndex = state.postList.findIndex((item) => item.id === postId)
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
      console.log('finish', current(state))
    })
    .addCase(startEditingPost, (state, action) => {
      const postId = action.payload
      const foundPost = state.postList.find((item) => item.id === postId) || null
      state.editingPost = foundPost
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    })
    .addMatcher(
      (action) => action.type.includes('cancel'),
      (state, action) => {
        console.log(current(state))
      }
    )
    .addDefaultCase((state, action) => {})
})
export default blogReducer
