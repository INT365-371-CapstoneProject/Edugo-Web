import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import icon from '../assets/Vector.svg';
import image2 from '../assets/bg-file-image.png';
import { useNavigate } from 'react-router-dom';
import { getAnnounce } from '../composable/getAnnounce';
import { urlImage } from '../composable/getImage';
import image_No_Scholarship from '../assets/No_Scholarship.png';
import '../style/style.css'; // Import CSS file
import '../style/home.css'; // Import CSS file


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
            <div className="Background">
                <div className="Maincontainer">
                    <div className="mx-8 mb-7">
                        <div className="grid grid-cols-2">
                            <div className="mt-5">
                                <h1 className="font-bold text-4xl text-black">Scholarship Management</h1>
                            </div>
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => navigate('/add')}
                                    className="btn button"
                                >
                                    Post Scholarship
                                    <img src={icon} alt="" />
                                </button>
                            </div>
                        </div>

                        {/* Buttons for Filter */}
                        <div className="summary-padding">
                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('All')}
                            >
                                <div className="border-l-4 border-blue-600 my-5">
                                    <h1 className="summary-text">All Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{announce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('Pending')}
                            >
                                <div className="border-l-4 border-gray-300 my-5">
                                    <h1 className="summary-text">Pending Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{checkPendingAnnounce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('Open')}
                            >
                                <div className="border-l-4 border-yellow-300 my-5">
                                    <h1 className="summary-text">Opened Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{checkOpenAnnounce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('Close')}
                            >
                                <div className="border-l-4 border-pink-600 my-5">
                                    <h1 className="summary-text">Closed Scholarship</h1>
                                    <div className="flex flex-row ml-8 mt-2">
                                        <h1 className="text-3xl font-bold">{checkCloseAnnounce.length}</h1>
                                        <h1 className="ml-5 my-auto font-bold text-lg">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* No Scholarship Filter */}
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
                        <div className="ScholarLayout">
                            {filteredAnnounce().map((announce, index) => (
                                <div
                                    key={index}
                                    className="border-lightgrey scholarship-card"
                                    onClick={() => navigate(`/detail/${announce.id}`)}
                                >
                                    <div className="grid grid-cols-2">
                                        <div className=" w-52 h-72 mt-5 mb-5">
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
                                                <h1 className="number-layout">
                                                    #0000{index + 1}
                                                </h1>
                                                <div
                                                    className={`rounded-md flex justify-center ${checkPendingAnnounce.some((item) => item.id === announce.id)
                                                        ? 'border-gray-400 bg-gray-100'
                                                        : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                            ? 'open-status'
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
                                            <div className="information-layout">
                                                <h1 className="headingclamp font-normal text-2xl text-black">
                                                    {announce.title}
                                                </h1>
                                                <h1 className="font-normal mt-4 text-medium text-black">
                                                    Description
                                                </h1>
                                                <p className="descriptionclamp text-sm mt-2 text-gray-400">
                                                    {announce.description}
                                                </p>
                                                <h1 className="font-normal mt-2 text-medium text-black">
                                                    Scholarship period
                                                </h1>
                                                <h1 className="mt-2 font-medium text-lg color-[#2A4CCC]">
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
