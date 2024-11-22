import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAnnounce } from '../composable/getAnnounce'
import { Link } from 'react-router-dom'
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
  const navigate = useNavigate()
  const gotoDetail = (id) => {
    navigate(`/detail/${id}`)
  }
  return (
    <>
      <Nav />
      <div className="overflow-x-auto m-10">
        <h1 className="text-3xl font-bold text-center">All Posts</h1>
        <Link to='/add' className="btn btn-ghost bg-blue-300">Add Post</Link>
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
                <td>
                  <button className="btn btn-sm btn-ghost bg-green-300" onClick={()=> gotoDetail(post.id)}>Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default PostAll