import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPostById } from '../composable/getPosts'
import Nav from './Nav'
function Detail() {
    const { id } = useParams()
    const [post, setPost] = React.useState({})
    useEffect(() => {
        getPostById(id)
            .then(data => {
                if (data) {
                    setPost(data)
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
            <div className="min-h-screen flex flex-col">
                <div className='ml-20 mt-8 text-3xl font-bold'>Post Detail:</div>
                <div className='border my-5 w-11/12 mx-auto flex flex-row'>
                    <div className="font-bold">
                        <h3 className="mt-5 ml-4">Title</h3>
                        <h3 className="mt-5 ml-4">Description</h3>
                        <h3 className="mt-5 ml-4">Url</h3>
                        <h3 className="mt-5 ml-4">Image</h3>
                        <h3 className="mt-5 ml-4">Publish Date</h3>
                        <h3 className="mt-5 ml-4">Close Date</h3>
                    </div>
                    <div className="ml-20 ann-item ">
                        <p className="mt-5 ml-4">{post.title}</p>
                        <p className="mt-5 ml-4">{post.description}</p>
                        <p className="mt-5 ml-4">{post.url ? post.url : "No URL available"}</p>
                        <p className="mt-5 ml-4">{post.attach_file ? post.attach_file : "No Image available"}</p>
                        <p className="mt-5 ml-4">{post.published_date}</p>
                        <p className="mt-5 ml-4">{post.closed_date ? post.closed_date : "No Close Date available"}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Detail