import React from 'react'
import Nav from './Nav'
import icon from '../assets/Vector.svg'
import image2 from '../assets/2.png'
import { useNavigate } from 'react-router-dom'
function Homepage() {
    const navigate = useNavigate();
    const handletoAdd = () => {
        navigate('/add')
    }
    return (
        <>
            <Nav />
            <div className="w-2/3 m-auto h-auto mt-10">
                <div className="border-2 border-gray-300 rounded-lg">


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
                                        <h1 className='text-3xl font-bold'>4</h1>
                                        <h1 className='ml-5 my-auto font-bold text-lg'>Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className=' border-l-4 border-yellow-300 my-3'>
                                    <h1 className='ml-8 text-2xl font-medium'>Opened Scholarship</h1>
                                    <div className='flex flex-row ml-8 mt-2'>
                                        <h1 className='text-3xl font-bold'>2</h1>
                                        <h1 className='ml-5 my-auto font-bold text-lg'>Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className=' border-l-4 border-pink-600 my-3'>
                                    <h1 className='ml-8 text-2xl font-medium'>Closed Scholarship</h1>
                                    <div className='flex flex-row ml-8 mt-2'>
                                        <h1 className='text-3xl font-bold'>2</h1>
                                        <h1 className='ml-5 my-auto font-bold text-lg'>Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className='grid grid-cols-2 mt-10 gap-12'>

                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className='grid grid-cols-2'>
                                    <div className='m-5 my-auto'>
                                        <img src={image2} alt="" />
                                    </div>
                                    <div className='divide-y m-5 space-y-4'>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='font-medium text-lg text-gray-400'>#00001</h1>
                                            <div className='border-2 border-lime-400 rounded-md bg-lime-100 flex justify-center'>
                                                <h1 className='font-medium text-lg text-lime-400'>Open</h1>
                                            </div>
                                        </div>
                                        <div className='py-5'>
                                            <h1 className='font-semibold text-2xl'>Scholarship Oppurtunities Canada</h1>
                                            <h1 className='mt-4 font-medium text-lg'>Description</h1>
                                            <p className='text-sm mt-2 text-gray-400'>Lorem ipsum dolor sit amet consectetur. Facilisi cras amet ultrices lacus nibh. Tempors....</p>
                                            <h1 className='mt-2 font-medium text-lg' >Scholarship period</h1>
                                            <h1 className='mt-2 font-medium text-lg text-blue-500' >Jan - May 2024</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className='grid grid-cols-2'>
                                    <div className='m-5 my-auto'>
                                        <img src={image2} alt="" />
                                    </div>
                                    <div className='divide-y m-5 space-y-4'>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='font-medium text-lg text-gray-400'>#00001</h1>
                                            <div className='border-2 border-lime-400 rounded-md bg-lime-100 flex justify-center'>
                                                <h1 className='font-medium text-lg text-lime-400'>Open</h1>
                                            </div>
                                        </div>
                                        <div className='py-5'>
                                            <h1 className='font-semibold text-2xl'>Scholarship Oppurtunities Canada</h1>
                                            <h1 className='mt-4 font-medium text-lg'>Description</h1>
                                            <p className='text-sm mt-2 text-gray-400'>Lorem ipsum dolor sit amet consectetur. Facilisi cras amet ultrices lacus nibh. Tempors....</p>
                                            <h1 className='mt-2 font-medium text-lg' >Scholarship period</h1>
                                            <h1 className='mt-2 font-medium text-lg text-blue-500' >Jan - May 2024</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className='grid grid-cols-2'>
                                    <div className='m-5 my-auto'>
                                        <img src={image2} alt="" />
                                    </div>
                                    <div className='divide-y m-5 space-y-4'>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='font-medium text-lg text-gray-400'>#00001</h1>
                                            <div className='border-2 border-lime-400 rounded-md bg-lime-100 flex justify-center'>
                                                <h1 className='font-medium text-lg text-lime-400'>Open</h1>
                                            </div>
                                        </div>
                                        <div className='py-5'>
                                            <h1 className='font-semibold text-2xl'>Scholarship Oppurtunities Canada</h1>
                                            <h1 className='mt-4 font-medium text-lg'>Description</h1>
                                            <p className='text-sm mt-2 text-gray-400'>Lorem ipsum dolor sit amet consectetur. Facilisi cras amet ultrices lacus nibh. Tempors....</p>
                                            <h1 className='mt-2 font-medium text-lg' >Scholarship period</h1>
                                            <h1 className='mt-2 font-medium text-lg text-blue-500' >Jan - May 2024</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='border-2 border-gray-300 rounded-lg'>
                                <div className='grid grid-cols-2'>
                                    <div className='m-5 my-auto'>
                                        <img src={image2} alt="" />
                                    </div>
                                    <div className='divide-y m-5 space-y-4'>
                                        <div className='grid grid-cols-2'>
                                            <h1 className='font-medium text-lg text-gray-400'>#00001</h1>
                                            <div className='border-2 border-lime-400 rounded-md bg-lime-100 flex justify-center'>
                                                <h1 className='font-medium text-lg text-lime-400'>Open</h1>
                                            </div>
                                        </div>
                                        <div className='py-5'>
                                            <h1 className='font-semibold text-2xl'>Scholarship Oppurtunities Canada</h1>
                                            <h1 className='mt-4 font-medium text-lg'>Description</h1>
                                            <p className='text-sm mt-2 text-gray-400'>Lorem ipsum dolor sit amet consectetur. Facilisi cras amet ultrices lacus nibh. Tempors....</p>
                                            <h1 className='mt-2 font-medium text-lg' >Scholarship period</h1>
                                            <h1 className='mt-2 font-medium text-lg text-blue-500' >Jan - May 2024</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Homepage