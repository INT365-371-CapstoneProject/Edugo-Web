import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import icon from '../assets/Vector.svg';
import image2 from '../assets/bg-file-image.png';
import { useNavigate } from 'react-router-dom';
import { getAnnounce } from '../composable/getAnnounce';
import { urlImage } from '../composable/getImage';
import image_No_Scholarship from '../assets/No_Scholarship.png';

function Homepage() {
    const [announce, setAnnounce] = useState([]);
    const [filterType, setFilterType] = useState('All'); // เพิ่ม state สำหรับประเภทที่เลือก

    useEffect(() => {
        getAnnounce()
            .then((data) => {
                if (data) {
                    setAnnounce(data);
                } else {
                    console.log('No data found or an error occurred.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const navigate = useNavigate();


    const checkOpenAnnounce = announce.filter((announce) => {
        const localPublishedDate = new Date(announce.publish_date);
        const localCloseDate = new Date(announce.close_date);
        const nowInLocalTime = new Date();
        return localPublishedDate <= nowInLocalTime && localCloseDate >= nowInLocalTime;
    });

    const checkPendingAnnounce = announce.filter((announce) => {
        const localPublishedDate = new Date(announce.publish_date);
        const nowInLocalTime = new Date();
        return localPublishedDate > nowInLocalTime;
    });

    const checkCloseAnnounce = announce.filter((announce) => {
        const localCloseDate = new Date(announce.close_date);
        const nowInLocalTime = new Date();
        return localCloseDate < nowInLocalTime;
    });

    const filteredAnnounce = () => {
        if (filterType === 'Open') return checkOpenAnnounce;
        if (filterType === 'Close') return checkCloseAnnounce;
        if (filterType === 'Pending') return checkPendingAnnounce;
        return announce; // Default to show all
    };

    const handleFilterClick = (type) => {
        setFilterType(type);
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <>
            <Nav />
            <div className="w-2/3 m-auto h-auto mt-10">
                <div className="border-2 border-gray-300 rounded-lg pb-5">
                    <div className="mx-8">
                        <div className="grid grid-cols-2">
                            <div className="mt-5">
                                <h1 className="font-bold text-4xl">Scholarship Management</h1>
                            </div>
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => navigate('/add')}
                                    className="btn hover:bg-blue-700 bg-blue-500 text-white border-none w-1/3"
                                >
                                    Post Scholarship
                                    <img src={icon} alt="" />
                                </button>
                            </div>
                        </div>

                        {/* Buttons for Filter */}
                        <div className="grid grid-cols-4 mt-10 gap-x-8">
                            <div
                                className="border-2 border-gray-300 rounded-lg cursor-pointer"
                                onClick={() => handleFilterClick('All')}
                            >
                                <div className="border-l-4 border-blue-600 my-5">
                                    <h1 className="ml-8 text-2xl font-medium">All Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{announce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-2 border-gray-300 rounded-lg cursor-pointer"
                                onClick={() => handleFilterClick('Pending')}
                            >
                                <div className="border-l-4 border-gray-300 my-5">
                                    <h1 className="ml-8 text-xl font-medium">Pending Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{checkPendingAnnounce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-2 border-gray-300 rounded-lg cursor-pointer"
                                onClick={() => handleFilterClick('Open')}
                            >
                                <div className="border-l-4 border-yellow-300 my-5">
                                    <h1 className="ml-8 text-xl font-medium">Opened Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{checkOpenAnnounce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-2 border-gray-300 rounded-lg cursor-pointer"
                                onClick={() => handleFilterClick('Close')}
                            >
                                <div className="border-l-4 border-pink-600 my-5">
                                    <h1 className="ml-8 text-xl font-medium">Closed Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{checkCloseAnnounce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mt-10 flex justify-center items-center flex-col">
                            {filterType === 'All' && announce.length === 0 && (
                                <>
                                    <h1 className="text-4xl font-bold text-gray-300">No Scholarship here</h1>
                                    <img src={image_No_Scholarship} alt="" className="mt-10" />
                                </>
                            )}
                            {filterType !== 'All' && filteredAnnounce().length === 0 && (
                                <>
                                    <h1 className="text-4xl font-bold text-gray-300">No Scholarship here</h1>
                                    <img src={image_No_Scholarship} alt="" className="mt-10" />
                                </>
                            )}
                        </div>

                        {/* Scholarship List */}
                        <div className="grid grid-cols-2 mt-10 gap-12">
                            {filteredAnnounce().map((announce, index) => (
                                <div
                                    key={index}
                                    className="border-2 border-gray-300 rounded-lg cursor-pointer"
                                    onClick={() => navigate(`/detail/${announce.id}`)}
                                >
                                    <div className="grid grid-cols-2">
                                        <div className="m-auto w-52 h-72 mt-10 mb-10">
                                            <img className='w-full h-full object-cover rounded-lg'
                                                src={
                                                    announce.image
                                                        ? `${urlImage}${announce.image}`
                                                        : image2
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="divide-y m-5 space-y-4">
                                            <div className="grid grid-cols-2">
                                                <h1 className="font-medium text-lg text-gray-400">
                                                    #0000{index + 1}
                                                </h1>
                                                <div
                                                    className={`border-2 rounded-md flex justify-center ${checkPendingAnnounce.some((item) => item.id === announce.id)
                                                        ? 'border-gray-400 bg-gray-100'
                                                        : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                            ? 'border-lime-400 bg-lime-100'
                                                            : 'border-red-400 bg-red-100'
                                                        }`}
                                                >
                                                    <h1
                                                        className={`font-medium text-lg ${checkPendingAnnounce.some((item) => item.id === announce.id)
                                                            ? 'text-gray-400'
                                                            : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                                ? 'text-lime-400'
                                                                : 'text-red-400'
                                                            }`}
                                                    >
                                                        {checkPendingAnnounce.some((item) => item.id === announce.id)
                                                            ? 'Pending'
                                                            : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                                ? 'Open'
                                                                : 'Close'}
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className="py-5 break-words">
                                                <h1 className="font-semibold text-2xl">
                                                    {announce.title}
                                                </h1>
                                                <h1 className="mt-4 font-medium text-lg">
                                                    Description
                                                </h1>
                                                <p className="text-sm mt-2 text-gray-400">
                                                    {announce.description}
                                                </p>
                                                <h1 className="mt-2 font-medium text-lg">
                                                    Scholarship period
                                                </h1>
                                                <h1 className="mt-2 font-medium text-lg text-blue-500">
                                                    {formatDate(announce.publish_date)} -{' '}
                                                    {formatDate(announce.close_date)}
                                                </h1>
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
    );
}

export default Homepage;
