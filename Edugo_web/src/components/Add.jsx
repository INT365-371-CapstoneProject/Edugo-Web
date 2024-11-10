import React, { useState } from 'react';
import { url } from '../composable/getPosts';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import image from '../assets/bg-file-image.png';

function Add() {
    // const navigate = useNavigate();
    // const [addPost, setAddPost] = useState({
    //     "title": "",
    //     "description": "",
    //     "url": "",
    //     "attach_file": null,
    //     "post_type": "Announce",
    //     "published_date": "",
    //     "closed_date": "",
    //     "provider_id": 1,
    //     "user_id": 0
    // });


    // const [imagePreview, setImagePreview] = useState(null); // state สำหรับแสดงตัวอย่างรูป

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0]; // เลือกไฟล์รูปแรกที่ผู้ใช้เลือก
    //     if (file) {
    //         setAddPost({ ...addPost, attach_file: file }); // เก็บไฟล์ที่เลือกใน state
    //         setImagePreview(URL.createObjectURL(file)); // สร้าง URL ของไฟล์เพื่อแสดงผล
    //     }
    // };

    // const CheckAddPost = (addPost) => {
    //     const fieldsToCheck = Object.keys(addPost).filter(field => ['url', 'attach_file', 'published_date', 'closed_date', 'user_id'].includes(field));
    //     fieldsToCheck.forEach(field => {
    //         if (addPost[field] === "" || (field === 'user_id' && addPost[field] === 0)) {
    //             addPost[field] = null;
    //         }
    //     });
    //     CreatePost(addPost);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault(); // ป้องกันการรีเฟรชของหน้าเว็บ
    //     CheckAddPost(addPost);
    // };

    // const CreatePost = async (addPost) => {
    //     addPost.file = addPost.attach_file;
    //     addPost.attach_file = null;

    //     try {
    //         const res = await axios.post(`${url}/create`, addPost, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         });
    //         if (res.status === 201) {
    //             navigate('/');
    //         }
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    // }

    // เอาไว้เปลี่ยนสีข้อความในSelect
    const [selectedValue, setSelectedValue] = useState('');
    const handleChangeSelected = (event) => {
        setSelectedValue(event.target.value);
    };

    // เอาไว้ show รุปที่เลือก
    const [imagePreview, setImagePreview] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // เลือกไฟล์รูปแรกที่ผู้ใช้เลือก
        if (file) {
            const previewUrl = URL.createObjectURL(file); // สร้าง URL ของไฟล์เพื่อแสดงผล
            setImagePreview(previewUrl); // อัพเดท state ด้วย URL ที่สร้างขึ้น
        }
    };

    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');

    // ฟังก์ชันจัดรูปแบบวันที่
    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        if (dateValue) {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formatted = new Intl.DateTimeFormat('en-GB', options).format(new Date(dateValue));
            setFormattedDate(formatted);
            e.target.type = 'text'; // กลับไปเป็น text ทันทีที่เลือก
        }
    };

    // ฟังก์ชันจัดรูปแบบเวลา
    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        if (timeValue) {
            const [hours, minutes] = timeValue.split(':');
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            const formatted = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            setFormattedTime(formatted);
            e.target.type = 'text'; // กลับไปเป็น text ทันทีที่เลือก
        }
    };

    return (
        <>
            <Nav />
            <div className="w-2/3 m-auto h-auto mt-10">
                <div className="border-2 border-gray-300 rounded-lg">
                    {/* ส่วนหัวของเนื้อหา */}
                    <div className='mx-8'>
                        <div className='grid grid-cols-2'>
                            <div className='mt-5 '>
                                <h1 className='font-bold text-4xl'>Add New Scholarship</h1>
                            </div>
                            <div className='mt-5 flex justify-end '>
                                <Link to='/' className=' text-slate-400 underline underline-offset-2 hover:text-slate-500'>
                                    Back
                                </Link>
                            </div>
                        </div>
                        {/* ส่วนFrom */}
                        <form action="">
                            <div className='grid grid-rows-3 mt-10 gap-10'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div className='bg-no-repeat bg-cover rounded-lg' style={{ backgroundImage: `url(${imagePreview || image})` }}>
                                        <div className='bg-gray-700 bg-opacity-50 p-8 rounded-lg text-center w-full h-full flex'>
                                            <div className='my-auto'>
                                                <p className='text-white mb-4'>Photo Upload should size ...size ... maximum</p>
                                                <button type="button" onClick={() => document.getElementById('imageInput').click()} className='btn hover:bg-blue-700 bg-blue-500 text-white border-none'>
                                                    Upload Photo <input id="imageInput" type="file" accept='image/*' className='hidden' onChange={handleImageChange} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-span-2 border-2 border-gray-300 rounded-lg'>
                                        <div className='grid grid-rows-4 m-7 gap-2'>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>Scholarship Name
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input type="text" className='-mt-2 h-full border-2 border-gray-300 rounded-lg placeholder:text-slate-300 p-3 font-sans' placeholder='Fill scholarship name (required)' />
                                            </div>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>website (url)</label>
                                                <input type="text" className='-mt-2 h-full border-2 border-gray-300 rounded-lg placeholder:text-slate-300 p-3 font-sans' placeholder='Fill your website’s company' />
                                            </div>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>Type of Scholarship
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <select className={`-mt-1 border-2 border-gray-300 rounded-lg p-3 font-sans ${selectedValue ? 'text-black' : 'text-slate-300'}`}
                                                    value={selectedValue}
                                                    onChange={handleChangeSelected}>
                                                    <option value="" disabled>
                                                        Select type of scholarship
                                                    </option>
                                                    <option value="1" className=' text-black'>Full Scholarships</option>
                                                    <option value="2" className=' text-black'>Partial Tuition Scholarships</option>
                                                </select>
                                            </div>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>Country*
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <select className={`-mt-1 border-2 border-gray-300 rounded-lg p-3 font-sans ${selectedValue ? 'text-black' : 'text-slate-300'}`}
                                                    value={selectedValue}
                                                    onChange={handleChangeSelected}>
                                                    <option value="" disabled>
                                                        Select country of scholarship
                                                    </option>
                                                    <option value="1" className=' text-black'>Cannada</option>
                                                    <option value="2" className=' text-black'>China</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=' grid grid-rows-2 gap-10'>
                                    <div className='border-2 border-gray-300 rounded-lg h-2/3 grid grid-cols-2'>
                                        <div className='grid grid-rows-2 my-4 mx-8'>
                                            <label className='text-2xl font-medium'>Start Date</label>
                                            <div className='grid grid-cols-3 -mt-3 gap-14'>
                                                {/* ช่องสำหรับวันที่ */}
                                                <input
                                                    type="text"
                                                    placeholder="Select Date"
                                                    value={formattedDate}
                                                    onFocus={(e) => (e.target.type = 'date')} // เปลี่ยนเป็น type="date" เมื่อ focus
                                                    onChange={handleDateChange} // จัดรูปแบบวันที่เมื่อมีการเลือก
                                                    className="col-span-2 border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                />

                                                {/* ช่องสำหรับเวลา */}
                                                <input
                                                    type="text"
                                                    placeholder="Select Time"
                                                    value={formattedTime}
                                                    onFocus={(e) => (e.target.type = 'time')} // เปลี่ยนเป็น type="time" เมื่อ focus
                                                    onChange={handleTimeChange} // จัดรูปแบบเวลาเมื่อมีการเลือก
                                                    className="border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-rows-2 my-4 mx-8'>
                                            <label className='text-2xl font-medium'>End Date</label>
                                            <div className='grid grid-cols-3 -mt-3 gap-14'>
                                                {/* ช่องสำหรับวันที่ */}
                                                <input
                                                    type="text"
                                                    placeholder="Select Date"
                                                    value={formattedDate}
                                                    onFocus={(e) => (e.target.type = 'date')} // เปลี่ยนเป็น type="date" เมื่อ focus
                                                    onChange={handleDateChange} // จัดรูปแบบวันที่เมื่อมีการเลือก
                                                    className="col-span-2 border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                />

                                                {/* ช่องสำหรับเวลา */}
                                                <input
                                                    type="text"
                                                    placeholder="Select Time"
                                                    value={formattedTime}
                                                    onFocus={(e) => (e.target.type = 'time')} // เปลี่ยนเป็น type="time" เมื่อ focus
                                                    onChange={handleTimeChange} // จัดรูปแบบเวลาเมื่อมีการเลือก
                                                    className="border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='bg-blue-400'>

                                    </div>
                                </div>
                                <div className=''></div>
                                <div></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Add;
