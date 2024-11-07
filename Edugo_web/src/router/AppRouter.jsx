import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PostAll from '../components/PostAll'
import Detail from '../components/Detail'
import Add from '../components/Add'
import Homepage from '../components/Homepage'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/homepage" />
  },
  {
    path: '/homepage',
    element: <Homepage />,
  },
  {
    path: '/posts',
    element: <PostAll />,
  },
  {
    path: '/detail/:id',
    element: <Detail />
  },
  {
    path: '/add',
    element: <Add />
  }
])

function AppRouter() {
  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter