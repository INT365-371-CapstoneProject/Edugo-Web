import React, { useEffect, useState } from 'react'
import { getPosts } from '../composable/getPosts'
import Nav from './Nav'
function PostAll() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    getPosts()
      .then(data => {
        if (data) {
          setPosts(data)
        } else {
          console.log('No data found or an error occurred.')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }, [])
  return (
    <>
    <Nav />
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.id}>
              <th>{index + 1}</th>
              <td>{post.title}</td>
              <td>{post.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default PostAll