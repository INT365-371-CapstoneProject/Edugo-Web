import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnnounceById } from '../composable/getAnnounce'
import icon1 from '../assets/icon-attach.svg';
import icon2 from '../assets/Vector.svg'
import image1 from '../assets/cancel-post.png';
import image2 from '../assets/2.png';
import Nav from './Nav'
import { urlImage } from '../composable/getImage';
function Detail() {
    const { id } = useParams()
    const [announce, setAnnounce] = React.useState({})
    useEffect(() => {
        window.scrollTo(0, 0);
        getAnnounceById(id)
            .then(data => {
                if (data) {
                    setAnnounce(data)
                } else {
                    console.log('No data found or an error occurred.')
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    console.log(announce)

    // เอา published_date มาแปลงเป็นวันที่และเวลาเพื่อเอามา show
    const publishedDate = new Date(announce[0]?.published_date)
    const closeDate = new Date(announce[0]?.close_date)
    const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
    const publishedDateStr = publishedDate.toLocaleDateString('en-GB', optionsDate)
    const publishedTimeStr = publishedDate.toLocaleTimeString('en-GB', optionsTime)
    const closeDateStr = closeDate.toLocaleDateString('en-GB', optionsDate)
    const closeTimeStr = closeDate.toLocaleTimeString('en-GB', optionsTime)
    return (
        <>
            <Nav />
            <div className="w-2/3 m-auto h-auto mt-10 box-border">
                <div className="border-2 border-gray-300 rounded-lg">
                    {/* ส่วนหัวของเนื้อห�� */}
                    <div className='mx-8'>
                        <div className='grid grid-cols-2'>
                            <div className='mt-5'>
                                <Link to='/'className='font-bold text-4xl underline underline-offset-2 hover:text-slate-800'>Home</Link>
                            </div>
                            <div className='mt-5 flex justify-end '>
                                <Link to='/' className=' text-slate-400 underline underline-offset-2 hover:text-slate-500'>
                                    Back
                                </Link>
                            </div>
                        </div>
                        {/* ส่วนFrom */}
                        <div className='grid grid-rows-3 mt-10 gap-10'>
                            <div className='grid grid-cols-3 gap-4'>
                                <div className='bg-no-repeat bg-cover rounded-lg'>
                                    <img src={announce[0]?.image ? `${urlImage}${announce[0]?.image}` : image2} alt="" className='w-full h-96 rounded-lg' />
                                </div>
                                <div className='col-span-2 border-2 border-gray-300 rounded-lg'>
                                    <div className='grid grid-rows-4 m-7 gap-7'>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <h1 className='text-2xl font-medium'>Scholarship Name
                                                <span className="text-red-500">*</span>
                                            </h1>
                                            {announce && announce.length > 0 && announce[0].title ? (
                                                <h1 className='text-2xl font-medium text-gray-400'>{announce[0].title}</h1>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </div>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <label className='text-2xl font-medium'>website (url)</label>
                                            {announce && announce.length > 0 && announce[0].title ? (
                                                announce[0].url != "null" && announce[0].url != null ? (
                                                    <h1 className='text-2xl font-medium text-gray-400'>{announce[0].url}</h1>
                                                ) : (
                                                    <h1 className='text-2xl font-medium text-gray-400'>No website</h1>
                                                )
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </div>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <label className='text-2xl font-medium'>Type of Scholarship
                                                <span className="text-red-500">*</span>
                                            </label>
                                            {announce && announce.length > 0 && announce[0].category ? (
                                                <h1 className='text-2xl font-medium text-gray-400'>{announce[0].category}</h1>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </div>
                                        <div className='grid grid-rows-2 gap-2'>
                                            <label className='text-2xl font-medium'>Country
                                                <span className="text-red-500">*</span>
                                            </label>
                                            {announce && announce.length > 0 && announce[0].country ? (
                                                <h1 className='text-2xl font-medium text-gray-400'>{announce[0].country}</h1>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
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
                                        <div className='grid grid-cols-2'>
                                            <h1 className='text-xl font-medium text-gray-400'>{publishedDateStr ? (publishedDateStr) : (<p>Loading...</p>)}</h1>
                                            <h1 className='text-xl font-medium text-gray-400'>{publishedTimeStr ? (publishedTimeStr) : (<p>Loading...</p>)}</h1>
                                        </div>
                                    </div>
                                    <div className='grid grid-rows-2 my-4 mx-8'>
                                        <label className='text-2xl font-medium'>End Date
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='text-xl font-medium text-gray-400'>{closeDateStr ? (closeDateStr):(<p>Loading...</p>)}</h1>
                                            <h1 className='text-xl font-medium text-gray-400'>{closeTimeStr ? (closeTimeStr):(<p>Loading...</p>)}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className='-mt-14 border-2 border-gray-300 rounded-lg h-2/3 grid grid-rows-2 pb-3'>
                                    <div className='grid grid-cols-7 mx-8'>
                                        <label className='text-2xl font-medium items-center flex'>Attach Files</label>
                                        <p className='col-span-6 items-center flex text-slate-400 text-sm'>*upload PDF file with maximum size 300 MB</p>
                                    </div>
                                    <h1 className='mx-8 border-2 border-gray-300 rounded-lg h-12 flex items-center pl-7'>{announce && announce.length > 0 && announce[0].attach_file ? (announce[0].attach_file):(<p>Loading...</p>)}</h1>
                                </div>
                            </div>
                            <div className='-mt-28 border-2 border-gray-300 rounded-lg mb-40'>
                                <div className='mx-10 mt-6 flex flex-col'>
                                    <label className='text-2xl font-medium '>Description
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <h1 className='overflow-y-auto resize-none h-72 mt-2 font-sans p-3'>{announce && announce.length > 0 && announce[0].description ? (announce[0].description):(<p>Loading...</p>)}</h1>
                                </div>
                            </div>
                        </div>
                        <div className='-mt-32 flex justify-end'>
                            <button type='button' className='btn hover:bg-gray-700 bg-gray-500 text-white border-none w-1/5 mr-10'>Cancel Post
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
                            <button type='button' className='btn hover:bg-blue-700 bg-blue-500 text-white border-none w-1/5'>Post Scholarship
                                <img src={icon2} alt="" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Detail