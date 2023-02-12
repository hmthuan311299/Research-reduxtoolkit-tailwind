import CreatePost from './components/createPost'
import PostList from './components/postList'

const Blog = () => {
  return (
    <div className='p-5'>
      <CreatePost />
      <PostList />
    </div>
  )
}

export default Blog
