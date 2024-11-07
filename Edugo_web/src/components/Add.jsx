import React, { useState } from 'react';
import { url } from '../composable/getPosts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';

function Add() {
    const navigate = useNavigate();
    const [addPost, setAddPost] = useState({
        "title": "",
        "description": "",
        "url": "",
        "attach_file": null,
        "post_type": "Announce",
        "published_date": "",
        "closed_date": "",
        "provider_id": 1,
        "user_id": 0
    });

    const [imagePreview, setImagePreview] = useState(null); // state สำหรับแสดงตัวอย่างรูป

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // เลือกไฟล์รูปแรกที่ผู้ใช้เลือก
        if (file) {
            setAddPost({ ...addPost, attach_file: file }); // เก็บไฟล์ที่เลือกใน state
            setImagePreview(URL.createObjectURL(file)); // สร้าง URL ของไฟล์เพื่อแสดงผล
        }
    };

    const CheckAddPost = (addPost) => {
        const fieldsToCheck = Object.keys(addPost).filter(field => ['url', 'attach_file', 'published_date', 'closed_date', 'user_id'].includes(field));
        fieldsToCheck.forEach(field => {
            if (addPost[field] === "" || (field === 'user_id' && addPost[field] === 0)) {
                addPost[field] = null;
            }
        });
        CreatePost(addPost);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชของหน้าเว็บ
        CheckAddPost(addPost);
    };

    const CreatePost = async (addPost) => {
        addPost.file = addPost.attach_file;
        addPost.attach_file = null;
    
        try {
            const res = await axios.post(`${url}/create`, addPost, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (res.status === 201) {
                navigate('/');
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Nav />
            <div className='min-h-screen flex flex-col'>
                <div className='ml-20 mt-8'>
                    <h1 className='text-3xl font-bold'>Post Detail:</h1>

                    <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input type="text" value={addPost.title} onChange={(e) => setAddPost({ ...addPost, title: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type here" required />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <input type="text" value={addPost.description} onChange={(e) => setAddPost({ ...addPost, description: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type here" required />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">url</label>
                            <input type="url" value={addPost.url} onChange={(e) => setAddPost({ ...addPost, url: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type here" />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                            <input type="file" accept='image/*' onChange={handleFileChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type here" />
                        </div>

                        {/* แสดงตัวอย่างรูปที่เลือก */}
                        {imagePreview && (
                            <div className="mb-5">
                                <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" />
                            </div>
                        )}

                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Add;
