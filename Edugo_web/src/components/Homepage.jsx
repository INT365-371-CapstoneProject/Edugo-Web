import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import icon from '../assets/Vector.svg'
import image2 from '../assets/2.png'
import { useNavigate } from 'react-router-dom'
import { getAnnounce } from '../composable/getAnnounce'
function Homepage() {
    const [announce, setAnnounce] = useState([])
    useEffect(() => {
        getAnnounce()
            .then(data => {
                if (data) {
                    setAnnounce(data)
                    console.log(data)
                } else {
                    console.log('No data found or an error occurred.')
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [])
    const countAllAnnounce = announce.length
    // ฟิลเตอร์ประกาศที่มีเวลาน้อยกว่าปัจจุบันในเวลาท้องถิ่น
    const checkOpenAnnounce = announce.filter(announce => {
        const localPublishedDate = new Date(announce.published_date); // แปลงเป็น Local Time โดยอัตโนมัติ
        const localCloseDate = new Date(announce.close_date); // แปลงเป็น Local Time โดยอัตโนมัติ
        const nowInLocalTime = new Date(); // เวลาปัจจุบันใน Local Time
        if (localPublishedDate <= nowInLocalTime && localCloseDate >= nowInLocalTime) {
            return announce
        }
    });
    const countOpenAnnounce = checkOpenAnnounce.length;

    const checkCloseAnnounce = announce.filter(announce => {
        const localPublishedDate = new Date(announce.close_date); // แปลงเป็น Local Time โดยอัตโนมัติ
        const nowInLocalTime = new Date(); // เวลาปัจจุบันใน Local Time
        return localPublishedDate < nowInLocalTime;
    });
    const countCloseAnnounce = checkCloseAnnounce.length;
    // Function to format date to "MMM YYYY"
    const formatDate = (dateString) => {
        const options = { month: 'short', year: 'numeric' }; // ใช้เดือนแบบตัวย่อ (Jan, Feb)
        return new Date(dateString).toLocaleDateString('en-US', options); // กำหนดภาษา en-US
    };


    const navigate = useNavigate();
    const handletoAdd = () => {
        navigate('/add')
    }
    return (
        <>
            <Nav />
            <div className="w-2/3 m-auto h-auto mt-10">
                <div className="border-2 border-gray-300 rounded-lg pb-5">
                    <div className='mx-8'>
                        <div className='grid grid-cols-2'>
                            <div className='mt-5 '>
                                <h1 className='font-bold text-4xl'>Scholarship Management</h1>
                            </div>
                            <div className='mt-5 flex justify-end '>
                                <button onClick={handletoAdd} className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-1/3'>Post Scholarship
                                    <img src={icon} alt="" />
                                </button>
                            </div>
                        </div>



                        <div className='grid grid-cols-3 mt-10 gap-x-12'>
                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className=' border-l-4 border-blue-600 my-3'>
                                    <h1 className='ml-8 text-2xl font-medium'>All Scholarship</h1>
                                    <div className='flex flex-row ml-8 mt-2'>
                                        <h1 className='text-3xl font-bold'>{countAllAnnounce}</h1>
                                        <h1 className='ml-5 my-auto font-bold text-lg'>Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className=' border-l-4 border-yellow-300 my-3'>
                                    <h1 className='ml-8 text-2xl font-medium'>Opened Scholarship</h1>
                                    <div className='flex flex-row ml-8 mt-2'>
                                        <h1 className='text-3xl font-bold'>{countOpenAnnounce}</h1>
                                        <h1 className='ml-5 my-auto font-bold text-lg'>Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className=' border-l-4 border-pink-600 my-3'>
                                    <h1 className='ml-8 text-2xl font-medium'>Closed Scholarship</h1>
                                    <div className='flex flex-row ml-8 mt-2'>
                                        <h1 className='text-3xl font-bold'>{countCloseAnnounce}</h1>
                                        <h1 className='ml-5 my-auto font-bold text-lg'>Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className='grid grid-cols-2 mt-10 gap-12'>
                            {announce.map((announce, index) => (
                                <div key={index} className='border-2 border-gray-300 rounded-lg'>
                                    <div className='grid grid-cols-2'>
                                        <div className='m-5'>
                                            <img src={image2} alt="" />
                                        </div>
                                        <div className='divide-y m-5 space-y-4'>
                                            <div className='grid grid-cols-2'>
                                                <h1 className='font-medium text-lg text-gray-400'>#000{announce.id}</h1>
                                                <div
                                                    className={`border-2 rounded-md flex justify-center ${checkOpenAnnounce.some(item => item.id === announce.id)
                                                            ? 'border-lime-400 bg-lime-100'
                                                            : 'border-red-400 bg-red-100'
                                                        }`}
                                                >
                                                    <h1
                                                        className={`font-medium text-lg ${checkOpenAnnounce.some(item => item.id === announce.id)
                                                                ? 'text-lime-400'
                                                                : 'text-red-400'
                                                            }`}
                                                    >
                                                        {checkOpenAnnounce.some(item => item.id === announce.id) ? 'Open' : 'Close'}
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className='py-5'>
                                                <h1 className='font-semibold text-2xl'>{announce.title}</h1>
                                                <h1 className='mt-4 font-medium text-lg'>Description</h1>
                                                <p className='text-sm mt-2 text-gray-400'>{announce.description}</p>
                                                <h1 className='mt-2 font-medium text-lg' >Scholarship period</h1>
                                                <h1 className='mt-2 font-medium text-lg text-blue-500' >{formatDate(announce.published_date)} - {formatDate(announce.close_date)}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Homepage