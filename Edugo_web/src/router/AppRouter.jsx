import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PostAll from '../components/PostAll'
import About from '../components/About'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/posts" />
    },
    {
        path: '/posts',
        element: <PostAll />
    },
    {
        path: '/about',
        element: <About />
    }
])

function AppRouter() {
  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter