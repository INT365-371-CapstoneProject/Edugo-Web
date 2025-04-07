import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnnounceById, getAnnounceImage, getAnnounceAttach } from '../composable/getAnnounce'
import icon1 from '../assets/deleteicon.svg';
import icon from '../assets/editicon.svg'
import image2 from '../assets/bg-file-image.png';
import Nav from './Nav'
import axios from 'axios';
import image3 from '../assets/Trashillustration.png';
import { url } from '../composable/getAnnounce';
import '../style/style.css';
import '../style/details.css';
import jwt_decode from 'jwt-decode';

function Detail() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [announce, setAnnounce] = useState({})
    const [imageUrl, setImageUrl] = useState(null);
    const [attachUrl, setAttachUrl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false); // ป้องกันการกดปุ่ม delete ซ้ำ
    const [mediaFetched, setMediaFetched] = useState(false); // ป้องกันการเรียก media API ซ้ำ
    const modalRef = useRef(null);
    const navigatingRef = useRef(false); // ป้องกันการเรียก navigate ซ้ำ

    // ใช้ useEffect แยกสำหรับการโหลดข้อมูล token และ userRole
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUserRole(decoded.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserRole(null);
            }
        }
    }, []);

    // แยก useEffect สำหรับการโหลดข้อมูลประกาศ
    useEffect(() => {
        let isMounted = true;
        window.scrollTo(0, 0);
        
        const fetchAnnounceData = async () => {
            if (!id) return;
            
            try {
                const announceData = await getAnnounceById(id);
                if (announceData && isMounted) {
                    setAnnounce(announceData);
                }
            } catch (error) {
                console.error('Error fetching announce data:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAnnounceData();
        
        return () => {
            isMounted = false;
        };
    }, [id]);

    // แยก useEffect สำหรับโหลดรูปภาพและไฟล์แนบ
    useEffect(() => {
        let isMounted = true;
        
        // ถ้าเคยโหลด media แล้ว หรือยังไม่มี id หรือ announce ให้ return
        if (mediaFetched || !id || !announce || isLoading) {
            return;
        }
        
        const fetchMediaData = async () => {
            try {
                // โหลดรูปภาพ
                const imgUrl = await getAnnounceImage(id);
                if (imgUrl && isMounted) {
                    setImageUrl(imgUrl);
                }

                // โหลดไฟล์แนบ
                if (announce?.attach_file || announce?.attach_name) {
                    const attUrl = await getAnnounceAttach(id);
                    if (attUrl && isMounted) {
                        setAttachUrl(attUrl);
                    }
                }
                
                if (isMounted) {
                    setMediaFetched(true);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
            }
        };

        fetchMediaData();
        
        return () => {
            isMounted = false;
        };
    }, [id, announce, isLoading, mediaFetched]);

    // แยก useEffect สำหรับ cleanup เมื่อ component unmount
    useEffect(() => {
        return () => {
            if (imageUrl && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
            if (attachUrl && attachUrl.startsWith('blob:')) {
                URL.revokeObjectURL(attachUrl);
            }
        };
    }, []);

    // สร้างฟังก์ชัน format date แบบอ้างอิงข้อมูลจริง
    const formatDate = (dateString) => {
        if (!dateString) return { dateStr: "Loading...", timeStr: "Loading..." };
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return { dateStr: "Invalid date", timeStr: "Invalid time" };
            }
            
            const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
            const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
            
            return {
                dateStr: date.toLocaleDateString('en-GB', optionsDate),
                timeStr: date.toLocaleTimeString('en-GB', optionsTime)
            };
        } catch (error) {
            console.error('Error formatting date:', error);
            return { dateStr: "Error", timeStr: "Error" };
        }
    };
    
    // ใช้ useMemo เพื่อลด render
    const publishedDateFormatted = React.useMemo(() => formatDate(announce?.publish_date), [announce?.publish_date]);
    const closeDateFormatted = React.useMemo(() => formatDate(announce?.close_date), [announce?.close_date]);

    // ดูไฟล์ที่อัพโหลด
    const watchFile = () => {
        if (attachUrl) {
            window.open(attachUrl, '_blank');
        }
    }

    // func ลบข้อมูล
    const deleteData = async () => {
        if (isDeleting) return; // ป้องกันการกดซ้ำ
        setIsDeleting(true);
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${url}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                // ป้องกันการ navigate ซ้ำ
                if (!navigatingRef.current) {
                    navigatingRef.current = true;
                    navigate('/', { replace: true });
                }
            }
        }
        catch (error) {
            console.error(error);
            setIsDeleting(false); // เปลี่ยนสถานะกลับเมื่อมีข้อผิดพลาด
        }
    }

    // เพิ่มฟังก์ชันสำหรับการกลับไปยังหน้า Homepage ที่แท็บ Scholarship Management
    const handleBackToManagement = () => {
        // ป้องกันการ navigate ซ้ำ
        if (!navigatingRef.current) {
            navigatingRef.current = true;
            navigate('/#scholarships', { replace: true });
        }
    };

    // ถ้ากำลังโหลดข้อมูล จะแสดง loading screen
    if (isLoading) {
        return (
            <>
                <Nav />
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading scholarship details...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav />
            <div className="Background">
                <div className="Maincontainer">
                    {/* ส่วนหัวของเนื้อหา */}
                    <div className='mx-8'>
                        <div className='grid grid-cols-2'>
                            <div className='mt-5 grid grid-cols-5'>
                                {userRole && ['admin', 'superadmin'].includes(userRole) ? (
                                    <Link 
                                        to="/#scholarships" 
                                        className='font-bold text-4xl underline underline-offset-2 hover:text-slate-400'
                                    >
                                        Admin
                                    </Link>
                                ) : (
                                    <Link to='/' className='font-bold text-4xl underline underline-offset-2 hover:text-slate-800'>Home</Link>
                                )}
                                <h1 className='ml-5 mt-1 col-span-4 text-4xl font-medium font-DM text-blue-600 ml-2 truncate max-w-xs'>
                                    &gt; {announce?.title || 'Loading...'}
                                </h1>
                            </div>
                            <div className='mt-5 flex justify-end'>
                                {userRole && userRole !== 'admin' && userRole !== 'superadmin' && (
                                    <button 
                                        onClick={() => {
                                            if (!navigatingRef.current) {
                                                navigatingRef.current = true;
                                                navigate(`/edit/${id}`, { 
                                                    state: { 
                                                        imageUrl: imageUrl,
                                                        attachUrl: attachUrl,
                                                        attachName: announce.attach_name 
                                                    }
                                                });
                                            }
                                        }} 
                                        type='button' 
                                        className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-2/5'
                                    >
                                        Edit Scholarship
                                        <img src={icon} alt="" />
                                    </button>
                                )}
                                {/* เพิ่มปุ่มกลับสำหรับ admin และ superadmin */}
                                {userRole && ['admin', 'superadmin'].includes(userRole) && (
                                    <button 
                                        onClick={handleBackToManagement}
                                        type='button' 
                                        className='btn hover:bg-[#2A4CCC] bg-[#355FFF] text-white border-none w-2/5'
                                    >
                                        Back to Management
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* ส่วนFrom */}
                        <div className='grid grid-rows-3 mt-10 gap-10'>
                            <div className='grid grid-cols-3 gap-4'>
                                <div className='bg-no-repeat bg-cover rounded-lg'>
                                    <img 
                                        src={imageUrl || image2} 
                                        alt="" 
                                        className='w-full h-full object-cover rounded-lg'
                                        onError={(e) => {
                                            // ถ้าโหลดภาพไม่สำเร็จ ให้ใช้ภาพตัวอย่าง
                                            e.target.src = image2;
                                        }} 
                                    />
                                </div>
                                {/* พวกเนื้อหา */}
                                <div className='border-section col-span-2 '>
                                    <div className='detail-information-layout'>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <h1 className='heading-text'>Scholarship Name
                                                <span className="text-red-500">*</span>
                                            </h1>
                                            {announce ? (
                                                <h1 className='detail-information-text'>{announce.title}</h1>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </div>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <label className='heading-text'>website (url)</label>
                                            {announce ? (
                                                announce.url != "null" && announce.url != null ? (
                                                    <h1 className='detail-information-text hover:text-blue-300'>
                                                        <a href={announce.url} target="_blank" rel="noopener noreferrer">
                                                            {announce.url}
                                                        </a>
                                                    </h1>
                                                ) : (
                                                    <h1 className='detail-information-text'>No website</h1>
                                                )
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='grid grid-rows-2 gap-2'>
                                                <label className='heading-text'>Type of Scholarship
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                {announce ? (
                                                    <h1 className='detail-information-text'>{announce.category}</h1>
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </div>
                                            <div className='grid grid-rows-2 gap-2'>
                                                <label className='heading-text'>Educational Level
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                {announce ? (
                                                    <h1 className='detail-information-text'>{announce.education_level}</h1>
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <label className='heading-text'>Country
                                                <span className="text-red-500">*</span>
                                            </label>
                                            {announce ? (
                                                <h1 className='detail-information-text'>{announce.country}</h1>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* พวกวันที่และเวลา */}
                            <div className=' date-layout'>
                                <div className='border-section h-2/3 grid grid-cols-2'>
                                    <div className='grid grid-rows-2 my-4 mx-8 pt-4'>
                                        <label className='heading-text'>Start Date
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='date-text'>{publishedDateFormatted.dateStr}</h1>
                                            <h1 className='date-text'>{publishedDateFormatted.timeStr}</h1>
                                        </div>
                                    </div>
                                    <div className='grid grid-rows-2 my-4 mx-8 pt-4'>
                                        <label className='heading-text'>End Date
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='date-text'>{closeDateFormatted.dateStr}</h1>
                                            <h1 className='date-text'>{closeDateFormatted.timeStr}</h1>
                                        </div>
                                    </div>
                                </div>
                                {/* พวกแนบไฟล์ */}
                                <div className='-mt-14 border-section rounded-lg h-2/3 grid grid-rows-2 pb-3'>
                                    <div className='grid grid-cols-7 mx-8'>
                                        <label className='heading-text items-center flex'>Attach Files</label>
                                        <p className='col-span-6 items-center flex text-slate-400 text-sm'>*upload PDF file with maximum size 5 MB</p>
                                    </div>
                                    {announce ? (
                                        announce.attach_name ? (
                                            <h1
                                                className='attach-file-text'
                                                onClick={watchFile}
                                            >
                                                {announce.attach_name} {/* แสดง attach_name แทน attach_file */}
                                            </h1>
                                        ) : (
                                            <h1 className='mx-8 border-section rounded-lg h-12 flex items-center pl-7'>No Attach Files</h1>
                                        )
                                    ) : (
                                        <p className='mx-8 border-section rounded-lg h-12 flex items-center pl-7' >Loading...</p>
                                    )}
                                </div>
                            </div>
                            {/* พวกรายละเอียด */}
                            <div className='-mt-28 border-section rounded-lg mb-40'>
                                <div className='mx-8 mt-7 flex flex-col'>
                                    <label className='heading-text'>Description
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <h1 className='description-textarea whitespace-pre-line'>{announce ? (announce.description) : (<p>Loading...</p>)}</h1>
                                </div>
                            </div>
                        </div>
                        <div className='-mt-32 flex justify-end mb-5'>
                            <button 
                                type='button' 
                                disabled={isDeleting}
                                onClick={() => {
                                    if (modalRef.current) {
                                        modalRef.current.showModal();
                                    } else if (document.getElementById('my_modal_5')) {
                                        document.getElementById('my_modal_5').showModal();
                                    }
                                }} 
                                className='btn hover:bg-rose-800 bg-redcolor text-white border-none w-1/5'
                            >
                                Delete Scholarship
                                <img src={icon1} alt="" />
                            </button>
                        </div>
                        <dialog id="my_modal_5" ref={modalRef} className="modal modal-bottom sm:modal-middle justify-center items-center">
                            <div className="modal-box bg-white">
                                <img src={image3} alt="" className='mb-4 justify-center items-center ml-8 mt-7 w-5/6' />
                                <p className="heading-text text-center">Are you sure you want to
                                    <span className="block">delete this scholarship ?</span></p>
                                <p className="delete-title-modal">{announce?.title || 'Loading...'}</p>
                                <div className="modal-action flex flex-col justify-center items-center">
                                    <div className='button-gap'>
                                        <button
                                            type='button'
                                            className="cancel-button"
                                            onClick={() => {
                                                if (modalRef.current) {
                                                    modalRef.current.close();
                                                } else if (document.getElementById('my_modal_5')) {
                                                    document.getElementById('my_modal_5').close();
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="discardbutton"
                                            disabled={isDeleting}
                                            onClick={() => {
                                                if (modalRef.current) {
                                                    modalRef.current.close();
                                                } else if (document.getElementById('my_modal_5')) {
                                                    document.getElementById('my_modal_5').close();
                                                }
                                                deleteData();
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Detail;