import React, { useEffect, useState } from 'react'
import { url } from '../composable/getAnnounce';
import axios from 'axios';
import Nav from './Nav';
import image from '../assets/bg-file-image.png';
import { getCountry } from '../composable/getCountry';
import { getCategory } from '../composable/getCategory';
import { getAnnounceById } from '../composable/getAnnounce';
import icon from '../assets/iconCarrier.svg';
import icon1 from '../assets/icon-attach.svg';
import icon2 from '../assets/Vector.svg'
import image1 from '../assets/cancel-post.png';
import image3 from '../assets/undraw_happy_announcement_re_tsm0 1.png';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/style.css'; // Import CSS file
import '../style/details.css'; // Import CSS file

function Add() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isEditMode = !!id;
    const [country, setCountry] = useState([]);
    const [category, setCategory] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('')
    const [imagePreview, setImagePreview] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');
    const [StartDate, setStartDate] = useState('');
    const [formattedDateEnd, setFormattedDateEnd] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [StartTime, setStartTime] = useState('');
    const [formattedTimeEnd, setFormattedTimeEnd] = useState('');
    const [EndTime, setEndTime] = useState('');
    const [checkDate, setCheckDate] = useState('');
    const [checkTime, setCheckTime] = useState('');
    const [checkDateEnd, setCheckDateEnd] = useState('');
    const [checkTimeEnd, setCheckTimeEnd] = useState('');
    const [checkEdit, setCheckEdit] = useState(false);
    const [showErrTitle, setShowErrTitle] = useState(false);
    const [showErrDescription, setShowErrDescription] = useState(false);
    const [showErrCategory, setShowErrCategory] = useState(false);
    const [showErrCountry, setShowErrCountry] = useState(false);
    const [addPost, setAddPost] = useState({
        "title": '',
        "description": '',
        "url": '',
        "attach_file": null,
        "image": null,
        "posts_type": "Announce",
        "publish_Date": '',
        "close_date": '',
        "category_id": '',
        "country_id": '',
        "education_level": '' // Add this line
    });
    const [editPost, setEditPost] = useState({});
    const [attachFileName, setAttachFileName] = useState(''); // เพิ่ม state สำหรับเก็บชื่อไฟล์แนบ

    // เพิ่ม state ใหม่สำหรับเก็บ URL รูปภาพจริง
    const [actualImageUrl, setActualImageUrl] = useState('');
    const [displayImage, setDisplayImage] = useState(image);

    const handletoHome = () => {
        if (isEditMode) {
            navigate(`/detail/${id}`);
        } else {
            navigate('/');
        }
    }

    // ดึงข้อมูลประกาศ ที่ต้องการแก้ไข
    useEffect(() => {
        if (isEditMode) {
            getAnnounceById(id)
                .then(data => {
                    if (data) {
                        setEditPost(data);
                        // รวมการ set ค่าเริ่มต้นทั้งหมดไว้ที่เดียว
                        setAddPost({
                            title: data.title || '',
                            description: data.description || '',
                            url: data.url || '',
                            category_id: data.category_id || '',
                            education_level: data.education_level || '',
                            country_id: data.country_id || ''
                        });
                        
                        // Set dropdown values
                        setSelectedValue(data.category_id?.toString() || '');
                        setSelectedCountry(data.country_id?.toString() || '');
                        
                        // Set other initial values
                        if (data.image) {
                            setImagePreview(`${urlImage}/${data.image}`);
                        }
                        if (data.attach_name) {
                            setAttachFileName(data.attach_name);
                            document.getElementById('fileNameInput').placeholder = data.attach_name;
                        }

                        // แยกวันที่และเวลา
                        const date = new Date(data.publish_date);
                        const dateEnd = new Date(data.close_date);

                        const formatDate = (date) => {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        };

                        const formatTime = (date) => {
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            return `${hours}:${minutes}`;
                        };

                        setFormattedDate(formatDate(date));
                        setFormattedTime(formatTime(date));
                        setFormattedDateEnd(formatDate(dateEnd));
                        setFormattedTimeEnd(formatTime(dateEnd));
                        setCheckDate(formatDate(date));
                        setCheckTime(formatTime(date));
                        setCheckDateEnd(formatDate(dateEnd));
                        setCheckTimeEnd(formatTime(dateEnd));

                        // Set initial values for StartDate, EndDate, StartTime, and EndTime
                        setStartDate(formatDate(date));
                        setEndDate(formatDate(dateEnd));
                        setStartTime(formatTime(date));
                        setEndTime(formatTime(dateEnd));

                        // Set initial values for addPost
                        setAddPost({
                            title: data.title,
                            description: data.description,
                            url: data.url
                        });
                    } else {
                        console.log('No data found or an error occurred.');
                    }
                })
                .catch(error => {
                    console.error(error);
                    setImagePreview(image);
                });
        }
    }, [id, isEditMode])

    useEffect(() => {
        if (isEditMode && location.state) {
            const { imageUrl, attachUrl, attachName } = location.state;
            if (imageUrl) {
                setImagePreview(imageUrl);
            }
            if (attachName) {
                setAttachFileName(attachName);
                document.getElementById('fileNameInput').placeholder = attachName;
            }
        }
    }, [isEditMode, location.state]);

    // เช็คว่ามีการแก้ไขข้อมูลหรือไม่
    useEffect(() => {
        if (isEditMode) {
            if (formattedDate === checkDate && formattedTime === checkTime && formattedDateEnd === checkDateEnd && formattedTimeEnd === checkTimeEnd) {
                if (addPost.title === '' && addPost.description === '' && addPost.category_id === 0 && addPost.country_id === 0 && addPost.url === '' && addPost.attach_file === null && addPost.image === null) {
                    setCheckEdit(true);
                } else {
                    setCheckEdit(false);
                }
            } else {
                setCheckEdit(false);
            }
        }
    }, [addPost, formattedDate, formattedDateEnd, formattedTime, formattedTimeEnd])

    // ดึงข้อมูลประเทศ
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

    const validateForm = () => {
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        const startDateTime = new Date(`${StartDate || checkDate}T${StartTime || checkTime}`);
        const endDateTime = new Date(`${EndDate || checkDateEnd}T${EndTime || checkTimeEnd}`);
        const now = new Date();

        if (!StartDate || !StartTime) {
            toast.error('Please provide both Start Date and Start Time');
            return false;
        }
        if (!EndDate || !EndTime) {
            toast.error('Please provide both End Date and End Time');
            return false;
        }

        if (isEditMode) {
            if (addPost.title && (addPost.title.length < 5 || addPost.title.length > 100)) {
                toast.error('Title must be between 5 and 100 characters');
                return false;
            }
            if (addPost.description && (addPost.description.length < 10 || addPost.description.length > 3000)) {
                toast.error('Description must be between 10 and 3000 characters');;
                return false;
            }
            if (addPost.url && (addPost.url.length < 10 || addPost.url.length > 255 || !urlPattern.test(addPost.url))) {
                toast.error('URL must be between 10 and 255 characters and must be a valid URL');
                return false;
            }
            if (addPost.attach_file && addPost.attach_file.size > 5 * 1024 * 1024) {
                toast.error('Attached file must be less than 5MB');
                return false;
            }
            if (addPost.image && addPost.image.size > 5 * 1024 * 1024) {
                toast.error('Image file must be less than 5MB');
                return false;
            }
            if (EndDate && endDateTime <= startDateTime) {
                toast.error('End Date must be after Start Date');
                return false;
            }
        } else {
            if (addPost.title.length < 5 || addPost.title.length > 100) {
                toast.error('Title must be between 5 and 100 characters');
                document.getElementById('title').style.border = '1px solid red';
                setShowErrTitle(true);
                return false;
            }
            if (addPost.description.length < 10 || addPost.description.length > 3000) {
                toast.error('Description must be between 10 and 3000 characters');
                document.getElementById('description').style.border = '1px solid red';
                setShowErrDescription(true);
                return false;
            }
            if (addPost.url && (addPost.url.length < 10 || addPost.url.length > 255 || !urlPattern.test(addPost.url))) {
                toast.error('URL must be between 10 and 255 characters and must be a valid URL');
                return false;
            }
            if (addPost.attach_file && addPost.attach_file.size > 5 * 1024 * 1024) {
                toast.error('Attached file must be less than 5MB');
                return false;
            }
            if (addPost.image && addPost.image.size > 5 * 1024 * 1024) {
                toast.error('Image file must be less than 5MB');
                return false;
            }
            if (!addPost.category_id) {
                toast.error('Please select a type of scholarship');
                document.getElementById('category').style.border = '1px solid red';
                setShowErrCategory(true);
                return false;
            }
            if (!addPost.country_id) {
                toast.error('Please select a country');
                document.getElementById('country').style.border = '1px solid red';
                setShowErrCountry(true);
                return false;
            }
            if (!EndDate || endDateTime <= startDateTime) {
                toast.error('End Date must be after Start Date');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชของหน้าเว็บ
        if (!validateForm()) return;

        document.getElementById('waiting_modal').showModal();

        if (isEditMode) {
            setIsSubmitting(true);
            if (formattedDate === checkDate && formattedTime === checkTime && formattedDateEnd === checkDateEnd && formattedTimeEnd === checkTimeEnd) {
                // เช็คว่ามีการแก้ไขข้อมูลหรือไม่
                if (addPost.title === '' && addPost.description === '' && addPost.category_id === 0 && addPost.country_id === 0 && addPost.url === '' && addPost.attach_file === null && addPost.image === null) {
                    navigate(`/detail/${id}`);
                } else {
                    // ถ้ามีการแก้ไขข้อมูล จะส่งไปแค่ข้อมูลที่แก้ไขเท่านั้น
                    const formData = new FormData();
                    const skipConditions = {
                        title: value => value === '',
                        description: value => value === '',
                        url: value => value === null || value === '',
                        attach_file: value => value === null,
                        image: value => value === null,
                        category_id: value => value === 0,
                        country_id: value => value === 0,
                        publish_Date: value => value === '',
                        close_date: value => value === '',
                        posts_type: value => value === 'Announce',
                        education_level: value => value === '' // Add this line
                    };

                    Object.entries(addPost).forEach(([key, value]) => {
                        if (skipConditions[key]?.(value)) {
                            return; // Skip if condition matches
                        }
                        formData.append(key, value); // Add to formData if not skipped
                    });

                    UpdatePost(formData);
                }
            } else {
                const startDateTime = new Date(`${StartDate || checkDate}T${StartTime || checkTime}`).toISOString();
                const endDateTime = new Date(`${EndDate || checkDateEnd}T${EndTime || checkTimeEnd}`).toISOString();
                const updatedPost = {
                    ...addPost,
                    publish_Date: startDateTime,
                    close_date: endDateTime
                };
                if (updatedPost.title === '' && updatedPost.description === '' && updatedPost.category_id === 0 && updatedPost.country_id === 0 && updatedPost.url === '' && updatedPost.attach_file === null && updatedPost.image === null) {
                    const formData = new FormData();
                    formData.append('publish_Date', startDateTime);
                    formData.append('close_date', endDateTime);
                    UpdatePost(formData);
                } else {
                    const formData = new FormData();
                    const skipConditions = {
                        title: value => value === '',
                        description: value => value === '',
                        url: value => value === null || value === '',
                        attach_file: value => value === null,
                        image: value => value === null,
                        category_id: value => value === 0,
                        country_id: value => value === 0,
                        publish_Date: value => value === '',
                        close_date: value => value === '',
                        posts_type: value => value === 'Announce',
                        education_level: value => value === '' // Add this line
                    };
                    Object.entries(updatedPost).forEach(([key, value]) => {
                        if (skipConditions[key]?.(value)) {
                            return; // Skip if condition matches
                        }
                        formData.append(key, value); // Add to formData if not skipped
                    });
                    UpdatePost(formData);
                }
            }
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

    const UpdatePost = async (formData) => {
        try {
            if (formData) {
                const token = localStorage.getItem("token");
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                };

                const res = await axios.put(`${url}/${id}`, formData, {
                    headers,
                    maxContentLength: 50 * 1024 * 1024,
                    maxBodyLength: 50 * 1024 * 1024,
                });
                if (res.status === 200) {
                    setTimeout(() => {
                        document.getElementById('waiting_modal').close();
                        navigate(`/detail/${id}`);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
            document.getElementById('waiting_modal').close();
            document.getElementById('error_modal').showModal();
        } finally {
            setIsSubmitting(false);
        }
    }


    const CreatePost = async (formData) => {
        try {
            if (formData) {
                const token = localStorage.getItem("token");
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                };

                const res = await axios.post(`${url}`, formData, {
                    headers,
                    maxContentLength: 50 * 1024 * 1024,
                    maxBodyLength: 50 * 1024 * 1024,
                });
                if (res.status === 201) {
                    setTimeout(() => {
                        document.getElementById('waiting_modal').close();
                        document.getElementById('success_modal').showModal();
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
            document.getElementById('waiting_modal').close();
            document.getElementById('error_modal').showModal();
        } finally {
            setIsSubmitting(false);
        }
    }

    // เอาไว้เปลี่ยนสีข้อความในSelect
    const handleChangeSelected = (event) => {
        setSelectedValue(event.target.value);
    };
    const handleChangeSelectedCountry = (event) => {
        setSelectedCountry(event.target.value);
    };


    // เอาไว้ show รุปที่เลือก
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        
        // Cleanup previous blob URL
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        
        if (file && !validImageTypes.includes(file.type)) {
            toast.error('Only JPG, JPEG, and PNG files are allowed');
            setAddPost(prev => ({ ...prev, image: null }));
            setImagePreview(image);
        } else if (file) {
            try {
                const newUrl = URL.createObjectURL(file);
                setImagePreview(newUrl);
                setAddPost(prev => ({ ...prev, image: file }));
            } catch (error) {
                console.error('Error creating blob URL:', error);
                setImagePreview(image);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            document.getElementById('fileNameInput').placeholder = attachFileName || 'No file chosen';
            setAddPost({ ...addPost, attach_file: null });
        } else if (file) {
            setAttachFileName(file.name);
            document.getElementById('fileNameInput').placeholder = file.name;
            setAddPost({ ...addPost, attach_file: file });
        }
    };

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
        if (isEditMode) {
            if (addPost.title || addPost.description || addPost.url || addPost.attach_file || addPost.image) {
                document.getElementById('my_modal_5').showModal();
            } else if (formattedDate == checkDate && formattedTime == checkTime && formattedDateEnd == checkDateEnd && formattedTimeEnd == checkTimeEnd) {
                handletoHome();
            } else {
                document.getElementById('my_modal_5').showModal();
            }
        } else {
            if (addPost.title || addPost.description || addPost.url || addPost.attach_file || addPost.image || formattedDate || formattedTime || formattedDateEnd || formattedTimeEnd) {
                document.getElementById('my_modal_5').showModal();
            } else {
                handletoHome();
            }
        }
    };

    useEffect(() => {
        return () => {
            // cleanup function จะทำงานเมื่อ component unmount
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            if (displayImage && displayImage.startsWith('blob:')) {
                URL.revokeObjectURL(displayImage);
            }
        };
    }, [imagePreview, displayImage]);

    useEffect(() => {
        if (addPost.title.length >= 5 && addPost.title.length <= 100) {
            document.getElementById('title').style.border = '1px solid #E5E7EB';
            setShowErrTitle(false);
        }
        if (addPost.description.length >= 10 && addPost.description.length <= 3000) {
            document.getElementById('description').style.border = '1px solid #E5E7EB';
            setShowErrDescription(false);
        }
        if (addPost.category_id !== 0) {
            document.getElementById('category').style.border = '1px solid #E5E7EB';
            setShowErrCategory(false);
        }
        if (addPost.country_id !== 0) {
            document.getElementById('country').style.border = '1px solid #E5E7EB';
            setShowErrCountry(false);
        }
    }, [addPost])

    return (
        <>
            <Nav />
            <ToastContainer />
            <div className="Background">
                <div className="Maincontainer">
                    {/* ส่วนหัวของเนื้อหา */}
                    <div className='mx-8'>
                        <div className='grid grid-cols-2'>
                            <div className='mt-7'>
                                <h1 className='font-bold text-4xl text-black'>{isEditMode ? 'Edit Scholarship' : 'Add New Scholarship'}</h1>
                            </div>
                            <div className='mt-5 flex justify-end '>
                                {/* ปุ่มกลับ */}
                                <Link className=' text-slate-400 underline underline-offset-2 hover:text-slate-500' onClick={handleCancel}>
                                    Back
                                </Link>
                            </div>
                        </div>
                        {/* ส่วนFrom */}
                        <form action="">
                            <div className='grid grid-rows-3 mt-10 gap-10'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {/* คอลัมน์สำหรับรูปภาพ */}
                                    <div className='relative rounded-lg overflow-hidden'>
                                        <img
                                            key={displayImage} // เพิ่ม key เพื่อบังคับให้ React render ใหม่เมื่อ URL เปลี่ยน
                                            src={imagePreview || image}
                                            alt=""
                                            className='w-full h-full object-cover rounded-lg'
                                            onError={() => {
                                                console.error('Image failed to load');
                                                setDisplayImage(image);
                                            }}
                                        />
                                        <div className='absolute inset-0 bg-gray-700 bg-opacity-50 p-8 flex justify-center items-center'>
                                            <div className='flex justify-center items-center flex-col text-center'>
                                                <p className='text-white mb-4'>Photo Upload should 1587 x 2245 maximum</p>
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('imageInput').click()}
                                                    className='btn hover:bg-blue-700 bg-blue-500 text-white border-none'
                                                >
                                                    Upload Photo <img src={icon} alt="" />
                                                    <input
                                                        id="imageInput"
                                                        type="file"
                                                        accept='image/*'
                                                        className='hidden'
                                                        onChange={handleImageChange}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* คอลัมน์ฟอร์ม */}
                                    <div className='col-span-2 border-section'>
                                        <div className='grid grid-rows-4 m-7 gap-5'>
                                            {/* ชื่อทุนการศึกษา */}
                                            <div className='grid grid-rows-2'>
                                                <label className='heading-text'>Scholarship Name
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id='title'
                                                    className='-mt-2 h-full border-section p-3'
                                                    placeholder={isEditMode ? editPost.title || '' : "Fill your scholarship's name"}
                                                    value={addPost.title || ''}
                                                    onChange={(e) => setAddPost(prev => ({ ...prev, title: e.target.value }))}
                                                />
                                                {showErrTitle && <p className='text-red-500 text-sm flex justify-end mt-1'>minimum 5 characters maximum 100 characters</p>}
                                            </div>

                                            {/* เว็บไซต์ */}
                                            <div className='grid grid-rows-2'>
                                                <label className='heading-text'>Website (URL)</label>
                                                <input
                                                    type="url"
                                                    className='-mt-2 h-full border-section p-3'
                                                    placeholder={isEditMode ? (editPost.url || "No Website") : "Fill your scholarship's website"}
                                                    value={addPost.url || ''}
                                                    onChange={(e) => setAddPost(prev => ({ ...prev, url: e.target.value }))}
                                                />
                                            </div>

                                            {/* ประเภทของทุน และ ระดับการศึกษา - แสดงในบรรทัดเดียวกัน */}
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='grid grid-rows-2'>
                                                    <label className='heading-text'>Type of Scholarship
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id='category'
                                                        className={`w-full -mt-1 border-section p-3 font-sans text-sm bg-white text-slate-300`}
                                                        value={isEditMode && !selectedValue ? 
                                                            category.find(item => item.category === editPost.category)?.id || '' 
                                                            : selectedValue || ''}
                                                        onChange={(e) => {
                                                            handleChangeSelected(e);
                                                            setAddPost(prev => ({ ...prev, category_id: e.target.value || '' }));
                                                        }}
                                                        style={{ color: selectedValue || editPost.category ? 'text-slate-300' : 'text-slate-300' }}
                                                    >
                                                        <option value="" disabled style={{ color: 'text-slate-300' }}>
                                                            {isEditMode ? editPost.category : 'Select category'}
                                                        </option>
                                                        {category.map((item, index) => (
                                                            <option 
                                                                key={index} 
                                                                value={item.id} 
                                                                style={{ color: 'black' }}
                                                            >
                                                                {item.category_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='grid grid-rows-2'>
                                                    <label className='heading-text'>Educational Level
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id='education_level'
                                                        className={`w-full -mt-1 border-section p-3 font-sans text-sm ${addPost.education_level ? 'text-black' : 'text-slate-300 bg-white'}`}
                                                        value={addPost.education_level || ''}
                                                        onChange={(e) => setAddPost(prev => ({ ...prev, education_level: e.target.value || '' }))}
                                                    >
                                                        <option value="" disabled>
                                                            {isEditMode ? editPost.education_level : 'Select level'}
                                                        </option>
                                                        <option value="Undergraduate" className='text-black'>Undergraduate</option>
                                                        <option value="Master" className='text-black'>Master</option>
                                                        <option value="Doctorate" className='text-black'>Doctorate</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* ประเทศ */}
                                            <div className='grid grid-rows-2'>
                                                <label className='heading-text'>Country
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id='country'
                                                    className={`-mt-1 border-section p-3 font-sans ${selectedCountry ? 'text-black' : 'text-slate-300 bg-white'}`}
                                                    value={selectedCountry || ''}
                                                    onChange={(e) => {
                                                        handleChangeSelectedCountry(e);
                                                        setAddPost(prev => ({ ...prev, country_id: e.target.value || '' }));
                                                    }}
                                                >
                                                    <option value="" disabled>
                                                        {isEditMode ? editPost.country : 'Select country of scholarship'}
                                                    </option>
                                                    {country.map((item, index) => (
                                                        <option key={index} value={item.id} className='text-black'>
                                                            {item.country_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {showErrCountry && <p className='text-red-500 text-sm flex justify-end mt-1'>Please select a country</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='date-layout'>
                                    <div className='border-section h-2/3 grid grid-cols-2 pt-3'>
                                        <div className='grid grid-rows-2 my-4 mx-8'>
                                            <label className='heading-text'>Start Date
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className='border-time-layout'>
                                                {/* ช่องสำหรับวันที่ */}
                                                <input
                                                    type="date"
                                                    placeholder="Select Date"
                                                    value={formattedDate || ''}
                                                    onChange={handleDateChange} // จัดรูปแบบวันที่เมื่อมีการเลือก
                                                    className="form-border"
                                                    required
                                                />

                                                {/* ช่องสำหรับเวลา */}
                                                <input
                                                    type="time"
                                                    placeholder="Select Time"
                                                    value={formattedTime || ''}
                                                    onChange={handleTimeChange} // จัดรูปแบบเวลาเมื่อมีการเลือก
                                                    className="time-border"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-rows-2 my-4 mx-8'>
                                            <label className='heading-text'>End Date
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className='border-time-layout'>
                                                {/* ช่องสำหรับวันที่ */}
                                                <input
                                                    type="date"
                                                    placeholder="Select Date"
                                                    value={formattedDateEnd || ''}
                                                    onChange={handleDateChangeEnd} // จัดรูปแบบวันที่เมื่อมีการเลือก
                                                    className="form-border col-span-2 font-sans text-center"
                                                    required
                                                />

                                                {/* ช่องสำหรับเวลา */}
                                                <input
                                                    type="time"
                                                    placeholder="Select Time"
                                                    value={formattedTimeEnd || ''}
                                                    onChange={handleTimeChangeEnd} // จัดรูปแบบเวลาเมื่อมีการเลือก
                                                    className="time-border"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* แนบไฟล์ */}
                                    <div className='-mt-14 border-section h-2/3 grid grid-rows-2 pb-4'>
                                        <div className='grid grid-cols-7 mx-8'>
                                            <label className='heading-text items-center flex'>Attach Files</label>
                                            <p className='col-span-6 items-center flex text-slate-400 text-sm'>*upload PDF file with maximum size 5 MB</p>
                                        </div>
                                        <div className='grid grid-cols-4 mx-8 gap-10'>
                                            <div className='flex justify-center items-center'>
                                                <button type='button' className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-full font-semibold text-base' onClick={() => {
                                                    document.getElementById('fileInput').click();
                                                }}>
                                                    Attach File <img src={icon1} alt="" />
                                                </button>
                                                <input id='fileInput' type="file" hidden onChange={handleFileChange} />
                                            </div>
                                            <div className='col-span-3 flex items-center'>
                                                <input id='fileNameInput' className='w-full h-4/5 pl-8 placeholder:text-black bg-white border-section ' type="text" placeholder={attachFileName || (isEditMode ? "No Attach Files" : "No file chosen")} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    {/* description */}
                                </div>
                                <div className='-mt-28 border-section mb-40'>
                                    <div className='mx-8 mt-6 flex flex-col'>
                                        <label className='heading-text'>Description
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea id='description' className='resize-none h-72 mt-4 font-sans p-4 border-section bg-white' value={addPost.description || ''}
                                            placeholder={isEditMode ? editPost.description || '' : "Provide additional details about the scholarship."}
                                            onChange={(e) => {
                                                setAddPost(prev => ({ ...prev, description: e.target.value }))
                                            }}></textarea>
                                        {showErrDescription && <p className='text-red-500 text-sm flex justify-end mt-1'>minimun 10 characters maximun 3,000 characters</p>}
                                    </div>
                                </div>
                            </div>
                            <div className='-mt-32 flex justify-end'>
                                <button type='button' className='btn hover:bg-gray-700 bg-gray-500 text-white border-none w-1/5 mr-10' onClick={handleCancel}>
                                    {isEditMode ? 'Cancel' : 'Cancel Post'}
                                </button>
                                {/* modal */}
                                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle justify-center items-center">
                                    <div className="modal-box bg-white">
                                        <img src={image1} alt="" className="mb-8 justify-center items-center ml-10 mt-9 w-5/6" />
                                        <p className="px-16 heading-text text-center">Are you sure you want to Discard this Edit?</p>
                                        <p className="pt-8 text-center text-base font-medium text-gray-400 pb-5">“The Progress will not be saved”</p>
                                        <div className="modal-action flex flex-col justify-center items-center">
                                            {/* เปลี่ยนจาก form เป็น div */}
                                            <div className='button-gap'>
                                                {/* ปุ่มปิด modal */}
                                                <button
                                                    type='button'
                                                    className="cancel-button"
                                                    onClick={() => document.getElementById('my_modal_5').close()}
                                                >
                                                    Cancel
                                                </button>
                                                {/* ปุ่มยืนยัน */}
                                                <button
                                                    className="discardbutton"
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
                                <dialog id="waiting_modal" className="modal modal-bottom sm:modal-middle justify-center items-center">
                                    <div className="modal-box bg-white flex flex-col justify-center items-center px-2">
                                        <div className="mt-4 w-28 h-28 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                                        <p className="heading-text text-center pt-6">{isEditMode ? 'Waiting for Saving...' : 'Waiting for Posting...'}</p>
                                    </div>
                                </dialog>
                                <dialog id="success_modal" className="modal modal-bottom sm:modal-middle justify-center items-center">
                                    <div className="modal-box bg-white">
                                        <img src={image3} alt="" className="mt-8 mb-4 justify-center items-center w-6/7" />
                                        <p className="heading-text text-center">Post Successful!</p>
                                        <div className="modal-action flex flex-col justify-center items-center">
                                            <button
                                                className="yes-button"
                                                onClick={() => {
                                                    document.getElementById('success_modal').close();
                                                    navigate('/');
                                                }}
                                            >
                                                Back to Home
                                            </button>
                                        </div>
                                    </div>
                                </dialog>
                                <dialog id="error_modal" className="modal modal-bottom sm:modal-middle justify-center items-center">
                                    <div className="modal-box bg-white">
                                        <p className="heading-text text-center">Error Occurred!</p>
                                        <p className="pt-8 text-center text-base font-medium text-gray-400 pb-5">An error occurred while posting your scholarship. Please try again.</p>
                                        <div className="modal-action flex flex-col justify-center items-center">
                                            <button
                                                type='button'
                                                className="yes-button"
                                                onClick={() => {
                                                    document.getElementById('error_modal').close();
                                                }}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </dialog>
                                {/* ปุ่ม Save */}
                                <button type='button' disabled={isEditMode ? checkEdit : isSubmitting} className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-1/5' onClick={handleSubmit}>{isEditMode ? 'Save Change' : 'Post Scholarship'}
                                    {isEditMode ? null : <img src={icon2} alt="" />}
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
