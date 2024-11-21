import React, { useEffect, useState } from 'react'
import { url } from '../composable/getAnnounce';
import axios from 'axios';
import Nav from './Nav';
import image from '../assets/bg-file-image.png';
import { getCountry } from '../composable/getCountry';
import { getCategory } from '../composable/getCategory';
import icon from '../assets/iconCarrier.svg';
import icon1 from '../assets/icon-attach.svg';
import icon2 from '../assets/Vector.svg'
import image1 from '../assets/cancel-post.png';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add() {
    const navigate = useNavigate();
    const handletoHome = () => {
        navigate('/')
    }
    // ดึงข้อมูลประเทศ
    const [country, setCountry] = useState([]);
    useEffect(() => {
        getCountry()
            .then(data => {
                if (data) {
                    setCountry(data);
                } else {
                    console.log('No data found or an error occurred.');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // ดึงข้อมูลประเภทของทุน
    const [category, setCategory] = useState([]);
    useEffect(() => {
        getCategory()
            .then(data => {
                if (data) {
                    setCategory(data);
                } else {
                    console.log('No data found or an error occurred.');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);


    const [addPost, setAddPost] = useState({
        "title": '',
        "description": '',
        "url": '',
        "attach_file": null,
        "image": null,
        "posts_type": "Announce",
        "publish_Date": '',
        "close_date": '',
        "category_id": 0,
        "country_id": 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชของหน้าเว็บ
        if (addPost.title === '' || addPost.description === '' || addPost.category_id === 0 || addPost.country_id === 0 || formattedDate === '' || formattedTime === '' || formattedDateEnd === '' || formattedTimeEnd === '') {
            toast.error('Please fill in all required fields');
            return;
        } else {
            setIsSubmitting(true); // ปิดปุ่ม submit
            const startDateTime = new Date(`${StartDate}T${StartTime}`).toISOString();
            const endDateTime = new Date(`${EndDate}T${EndTime}`).toISOString();
            const updatedPost = {
                ...addPost,
                publish_Date: startDateTime,
                close_date: endDateTime
            };
            const formData = new FormData();
            for (const key in updatedPost) {
                if (key === 'url' && (updatedPost[key] === null || updatedPost[key] === '')) {
                    continue;
                }
                if (key === 'attach_file' && updatedPost[key] === null) {
                    continue;
                }
                if (key === 'image' && updatedPost[key] === null) {
                    continue;
                }
                formData.append(key, updatedPost[key]);
            }
            CreatePost(formData);
        }
    };



    const CreatePost = async (formData) => {
        try {
            if (formData) {
                const res = await axios.post(`${url}/add`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                if (res.status === 201) {
                    navigate('/');
                }
            }
        }
        catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false); // เปิดปุ่ม submit อีกครั้ง
        }
    }

    // เอาไว้เปลี่ยนสีข้อความในSelect
    const [selectedValue, setSelectedValue] = useState('');;
    const handleChangeSelected = (event) => {
        setSelectedValue(event.target.value);
    };
    const [selectedCountry, setSelectedCountry] = useState('')
    const handleChangeSelectedCountry = (event) => {
        setSelectedCountry(event.target.value);
    };


    // เอาไว้ show รุปที่เลือก
    const [imagePreview, setImagePreview] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // เลือกไฟล์รูปแรกที่ผู้ใช้เลือก
        if (file) {
            const previewUrl = URL.createObjectURL(file); // สร้าง URL ของไฟล์เพื่อแสดงผล
            setImagePreview(previewUrl); // อัพเดท state ด้วย URL ที่สร้างขึ้น
            setAddPost({ ...addPost, image: file });
        }
    };

    const [formattedDate, setFormattedDate] = useState('');
    const [StartDate, setStartDate] = useState('');
    const [formattedDateEnd, setFormattedDateEnd] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [StartTime, setStartTime] = useState('');
    const [formattedTimeEnd, setFormattedTimeEnd] = useState('');
    const [EndTime, setEndTime] = useState('');

    // ฟังก์ชันจัดรูปแบบวันที่
    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        if (dateValue) {
            setStartDate(dateValue);
            const formatted = dateValue
            setFormattedDate(formatted);

        }
    };

    const handleDateChangeEnd = (e) => {
        const dateValue = e.target.value;
        if (dateValue) {
            setEndDate(dateValue);
            const formatted = dateValue
            setFormattedDateEnd(formatted);
        }
    }

    // ฟังก์ชันจัดรูปแบบเวลา
    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        if (timeValue) {
            setStartTime(timeValue);
            const formatted = timeValue
            setFormattedTime(formatted);
        }
    };

    const handleTimeChangeEnd = (e) => {
        const timeValue = e.target.value;
        if (timeValue) {
            setEndTime(timeValue);
            const formatted = timeValue
            setFormattedTimeEnd(formatted);
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        if (addPost.title || addPost.description || addPost.url || addPost.attach_file || addPost.image || formattedDate || formattedTime || formattedDateEnd || formattedTimeEnd) {
            document.getElementById('my_modal_5').showModal();
        } else {
            handletoHome();
        }
    };

    return (
        <>
            <Nav />
            <ToastContainer />
            <div className="w-2/3 m-auto h-auto mt-10 box-border">
                <div className="border-2 border-gray-300 rounded-lg">
                    {/* ส่วนหัวของเนื้อห�� */}
                    <div className='mx-8'>
                        <div className='grid grid-cols-2'>
                            <div className='mt-5 '>
                                <h1 className='font-bold text-4xl'>Add New Scholarship</h1>
                            </div>
                            <div className='mt-5 flex justify-end '>
                                <Link to='/' className=' text-slate-400 underline underline-offset-2 hover:text-slate-500' onClick={handleCancel}>
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
                                                    Upload Photo <img src={icon} alt="" />
                                                    <input id="imageInput" type="file" accept='image/*' className='hidden' onChange={handleImageChange} />
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
                                                <input type="text" className='-mt-2 h-full border-2 border-gray-300 rounded-lg placeholder:text-slate-300 p-3 font-sans' placeholder='Fill scholarship name (required)' value={addPost.title} onChange={(e) => setAddPost({ ...addPost, title: e.target.value })} />
                                            </div>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>website (url)</label>
                                                <input type="url" className='-mt-2 h-full border-2 border-gray-300 rounded-lg placeholder:text-slate-300 p-3 font-sans' placeholder='Fill your website’s company' value={addPost.url}
                                                    onChange={(e) => setAddPost({ ...addPost, url: e.target.value })} />
                                            </div>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>Type of Scholarship
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <select className={`-mt-1 border-2 border-gray-300 rounded-lg p-3 font-sans ${selectedValue ? 'text-black' : 'text-slate-300'}`}
                                                    value={selectedValue}
                                                    onChange={(e) => {
                                                        handleChangeSelected(e)
                                                        setAddPost({ ...addPost, category_id: e.target.value })
                                                    }}>
                                                    <option value="" disabled>
                                                        Select type of scholarship
                                                    </option>
                                                    {category.map((item, index) => (
                                                        <option key={index} value={item.id} className=' text-black'>{item.category_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='grid grid-rows-2'>
                                                <label className='text-2xl font-medium'>Country
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <select className={`-mt-1 border-2 border-gray-300 rounded-lg p-3 font-sans ${selectedCountry ? 'text-black' : 'text-slate-300'}`}
                                                    value={selectedCountry}
                                                    onChange={(e) => {
                                                        handleChangeSelectedCountry(e)
                                                        setAddPost({ ...addPost, country_id: e.target.value })
                                                    }}>
                                                    <option value="" disabled>
                                                        Select country of scholarship
                                                    </option>
                                                    {country.map((item, index) => (
                                                        <option key={index} value={item.id} className=' text-black'>{item.country_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=' grid grid-rows-2 gap-10'>
                                    <div className='border-2 border-gray-300 rounded-lg h-2/3 grid grid-cols-2'>
                                        <div className='grid grid-rows-2 my-4 mx-8'>
                                            <label className='text-2xl font-medium'>Start Date
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className='grid grid-cols-3 -mt-3 gap-14'>
                                                {/* ช่องสำหรับวันที่ */}
                                                <input
                                                    type="date"
                                                    placeholder="Select Date"
                                                    value={formattedDate}
                                                    onChange={handleDateChange} // จัดรูปแบบวันที่เมื่อมีการเลือก
                                                    className="col-span-2 border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                    required
                                                />

                                                {/* ช่องสำหรับเวลา */}
                                                <input
                                                    type="time"
                                                    placeholder="Select Time"
                                                    value={formattedTime}
                                                    onChange={handleTimeChange} // จัดรูปแบบเวลาเมื่อมีการเลือก
                                                    className="border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-rows-2 my-4 mx-8'>
                                            <label className='text-2xl font-medium'>End Date
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className='grid grid-cols-3 -mt-3 gap-14'>
                                                {/* ช่องสำหรับวันที่ */}
                                                <input
                                                    type="date"
                                                    placeholder="Select Date"
                                                    value={formattedDateEnd}
                                                    onChange={handleDateChangeEnd} // จัดรูปแบบวันที่เมื่อมีการเลือก
                                                    className="col-span-2 border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                    required
                                                />

                                                {/* ช่องสำหรับเวลา */}
                                                <input
                                                    type="time"
                                                    placeholder="Select Time"
                                                    value={formattedTimeEnd}
                                                    onChange={handleTimeChangeEnd} // จัดรูปแบบเวลาเมื่อมีการเลือก
                                                    className="border-2 border-gray-300 rounded-lg p-3 font-sans text-center"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='-mt-14 border-2 border-gray-300 rounded-lg h-2/3 grid grid-rows-2 pb-3'>
                                        <div className='grid grid-cols-7 mx-8'>
                                            <label className='text-2xl font-medium items-center flex'>Attach Files</label>
                                            <p className='col-span-6 items-center flex text-slate-400 text-sm'>*upload PDF file with maximum size 300 MB</p>
                                        </div>
                                        <div className='grid grid-cols-4 mx-8 gap-10'>
                                            <div className='flex justify-center items-center'>
                                                <button type='button' className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-full font-semibold text-base' onClick={() => {
                                                    document.getElementById('fileInput').click();
                                                }}>
                                                    Attach File <img src={icon1} alt="" />
                                                </button>
                                                <input id='fileInput' type="file" hidden onChange={(e) => {
                                                    const fileName = e.target.files[0]?.name;
                                                    document.getElementById('fileNameInput').placeholder = fileName || 'No file chosen';
                                                    setAddPost({ ...addPost, attach_file: e.target.files[0] });
                                                }} />
                                            </div>
                                            <div className='col-span-3 flex items-center'>
                                                <input id='fileNameInput' className='w-full h-4/5 pl-8 placeholder:text-black bg-white border-2 border-gray-400 rounded-lg ' type="text" placeholder='No file chosen' disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='-mt-28 border-2 border-gray-300 rounded-lg mb-40'>
                                    <div className='mx-10 mt-6 flex flex-col'>
                                        <label className='text-2xl font-medium '>Description
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea className='resize-none h-72 mt-2 font-sans p-3 border-2 border-gray-400 rounded-lg' value={addPost.description}
                                            onChange={(e) => {
                                                setAddPost({ ...addPost, description: e.target.value })
                                            }}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='-mt-32 flex justify-end'>
                                <button type='button' className='btn hover:bg-gray-700 bg-gray-500 text-white border-none w-1/5 mr-10' onClick={handleCancel}>Cancel Post
                                    <img src={icon2} alt="" />
                                </button>
                                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle justify-center items-center">
                                    <div className="modal-box px-20">
                                        <img src={image1} alt="" className="mb-5" />
                                        <p className="py-5 text-2xl font-medium text-center">Are you sure you want to Discard this Edit?</p>
                                        <p className="text-center text-base font-medium text-gray-400 pb-5">“The Progress will not be saved”</p>
                                        <div className="modal-action flex flex-col justify-center items-center">
                                            {/* เปลี่ยนจาก form เป็น div */}
                                            <div className='grid grid-cols-2 gap-10 w-full'>
                                                {/* ปุ่มปิด modal */}
                                                <button
                                                    type='button'
                                                    className="btn bg-gray-400 hover:bg-gray-500"
                                                    onClick={() => document.getElementById('my_modal_5').close()}
                                                >
                                                    Cancel
                                                </button>
                                                {/* ปุ่มยืนยัน */}
                                                <button
                                                    className="btn bg-pink-500 hover:bg-pink-600"
                                                    onClick={() => {
                                                        document.getElementById('my_modal_5').close();
                                                        handletoHome();
                                                    }}
                                                >
                                                    Yes, Discard this
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </dialog>
                                <button type='button'  disabled={isSubmitting} className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-1/5' onClick={handleSubmit}>Post Scholarship
                                    <img src={icon2} alt="" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Add;
