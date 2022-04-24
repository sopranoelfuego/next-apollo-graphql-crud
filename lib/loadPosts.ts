import { IPost } from './types'

export const loadPosts = async () => {
 const result = await fetch(`http://localhost:3000/api/post`)
 const posts: IPost[] = await result.json()
 return posts
}
