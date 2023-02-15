import {
  createReducer,
  createAction,
  current,
  PayloadAction,
  nanoid,
  createSlice,
  createAsyncThunk,
  AsyncThunk
} from '@reduxjs/toolkit'
import { IPost } from 'types/blog.type'
import http from 'utils/http'

interface BlogState {
  postList: IPost[]
  editingPost: IPost | null
  loading: Boolean
  currentRequestId: undefined | string
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>
type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const { data } = await http.get<IPost[]>('posts', { signal: thunkAPI.signal })
  return data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: IPost, thunkAPI) => {
  try {
    const { data } = await http.post<IPost>('posts', body, {
      signal: thunkAPI.signal
    })
    return data
  } catch (error: any) {
    if (error.name === 'AxiosError' && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
    throw error
  }
})
export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: String; body: IPost }, thunkAPI) => {
    try {
      const { data } = await http.put<IPost>(`posts/${postId}`, body, {
        signal: thunkAPI.signal
      })
      return data
    } catch (error: any) {
      if (error.name === 'AxiosError' && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
      throw error
    }
  }
)
export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkAPI) => {
  const { data } = await http.delete<IPost>(`posts/${postId}`, {
    signal: thunkAPI.signal
  })
  return data
})

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null
      state.editingPost = foundPost
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    },
    finishEditingPost: (state, action: PayloadAction<IPost>) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.some((post: IPost, index: number) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const id = action.meta.arg
        const foundPostIndex = state.postList.findIndex((post) => post.id === id)
        if (foundPostIndex > -1) {
          state.postList.splice(foundPostIndex, 1)
        }
      })
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state))
        }
      )
      .addMatcher<PendingAction>(
        //(action): action is PendingAction => action.type.endsWith('/pending')
        (action) => action.type.endsWith('/pending'), //map các action có đuổi url là pending
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      //action.meta.requestId khi gọi các request trong createThunk thì mỗi request sẽ tự sinh ra 1 id riêng biệt
      // .addMatcher(
      //   (action): action is RejectedAction => action.type.endsWith('/rejected'),
      //   (state, action) => {
      //     if (state.loading && state.currentRequestId === action.meta.requestId) {
      //       state.loading = false
      //       state.currentRequestId = undefined
      //     }
      //   }
      // )
      // .addMatcher(
      //   (action): action is FulfilledAction => action.type.endsWith('/fulfilled'),
      //   (state, action) => {
      //     if (state.loading && state.currentRequestId === action.meta.requestId) {
      //       state.loading = false
      //       state.currentRequestId = undefined
      //     }
      //   }
      // )
      .addMatcher<FulfilledAction | RejectedAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
      .addDefaultCase((state, action) => {
        console.log(`action type: ${action.type}`, current(state))
      })
  }
})

export const { cancelEditingPost, finishEditingPost, startEditingPost } = blogSlice.actions

export default blogSlice.reducer
