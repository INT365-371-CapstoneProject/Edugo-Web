import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import icon from '../assets/Vector.svg';
import image2 from '../assets/bg-file-image.png';
import { useNavigate } from 'react-router-dom';
import { getAnnounce, getAnnounceImage } from '../composable/getAnnounce';
import { urlImage } from '../composable/getImage';
import image_No_Scholarship from '../assets/No_Scholarship.png';
import '../style/style.css'; // Import CSS file
import '../style/home.css'; // Import CSS file
import jwt_decode from 'jwt-decode'; // Make sure to import jwt-decode

function Homepage() {
    const [announceData, setAnnounceData] = useState({
        data: [],
        total: 0,
        page: 1,
        last_page: 1,
        per_page: 10
    });
    const [allAnnouncements, setAllAnnouncements] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [announceImages, setAnnounceImages] = useState({});
    const [userRole, setUserRole] = useState(null);

    const fetchAllAnnouncements = async () => {
        try {
            let allData = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await getAnnounce(page);
                if (response && response.data && response.data.length > 0) {
                    allData = [...allData, ...response.data];
                    if (page >= response.last_page) {
                        hasMore = false;
                    }
                    page++;
                } else {
                    hasMore = false;
                }
            }
            setAllAnnouncements(allData);
        } catch (error) {
            console.error('Error fetching all announcements:', error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getAnnounce(currentPage),
            fetchAllAnnouncements()
        ]).then(([currentPageData]) => {
            if (currentPageData) {
                setAnnounceData(currentPageData);
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [currentPage]);

    useEffect(() => {
        // โหลดรูปภาพสำหรับทุกประกาศ
        const loadImages = async () => {
            try {
                const images = {};
                for (const announce of allAnnouncements) {
                    try {
                        const imageUrl = await getAnnounceImage(announce.id);
                        if (imageUrl) {
                            images[announce.id] = imageUrl;
                        }
                    } catch (error) {
                        console.error(`Error loading image for announcement ${announce.id}:`, error);
                    }
                }
                setAnnounceImages(images);
            } catch (error) {
                console.error('Error in loadImages:', error);
            }
        };

        if (allAnnouncements.length > 0) {
            loadImages();
        }
    }, [allAnnouncements]);

    useEffect(() => {
        // Clean up function to revoke object URLs
        return () => {
            Object.values(announceImages).forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    const navigate = useNavigate();


    const checkOpenAnnounce = allAnnouncements.filter((announce) => {
        const localPublishedDate = new Date(announce.publish_date);
        const localCloseDate = new Date(announce.close_date);
        const nowInLocalTime = new Date();
        return localPublishedDate <= nowInLocalTime && localCloseDate >= nowInLocalTime;
    });

    const checkPendingAnnounce = allAnnouncements.filter((announce) => {
        const localPublishedDate = new Date(announce.publish_date);
        const nowInLocalTime = new Date();
        return localPublishedDate > nowInLocalTime;
    });

    const checkCloseAnnounce = allAnnouncements.filter((announce) => {
        const localCloseDate = new Date(announce.close_date);
        const nowInLocalTime = new Date();
        return localCloseDate < nowInLocalTime;
    });

    const getFilteredData = () => {
        if (filterType === 'Open') {
            return allAnnouncements.filter(announce => {
                const localPublishedDate = new Date(announce.publish_date);
                const localCloseDate = new Date(announce.close_date);
                const nowInLocalTime = new Date();
                return localPublishedDate <= nowInLocalTime && localCloseDate >= nowInLocalTime;
            });
        } else if (filterType === 'Close') {
            return allAnnouncements.filter(announce => {
                const localCloseDate = new Date(announce.close_date);
                const nowInLocalTime = new Date();
                return localCloseDate < nowInLocalTime;
            });
        } else if (filterType === 'Pending') {
            return allAnnouncements.filter(announce => {
                const localPublishedDate = new Date(announce.publish_date);
                const nowInLocalTime = new Date();
                return localPublishedDate > nowInLocalTime;
            });
        }
        return allAnnouncements;
    };

    // แก้ไข filteredAnnounce function ไม่ให้มี state update
    const filteredAnnounce = () => {
        const filteredData = getFilteredData();
        const startIndex = (currentPage - 1) * announceData.per_page;
        const endIndex = startIndex + announceData.per_page;
        return filteredData.slice(startIndex, endIndex);
    };

    // แก้ไข handleFilterClick function
    const handleFilterClick = (type) => {
        const filteredData = type === 'All' ? allAnnouncements : allAnnouncements.filter(announce => {
            const nowInLocalTime = new Date();
            const localPublishedDate = new Date(announce.publish_date);
            const localCloseDate = new Date(announce.close_date);

            switch (type) {
                case 'Open':
                    return localPublishedDate <= nowInLocalTime && localCloseDate >= nowInLocalTime;
                case 'Close':
                    return localCloseDate < nowInLocalTime;
                case 'Pending':
                    return localPublishedDate > nowInLocalTime;
                default:
                    return true;
            }
        });

        const totalPages = Math.ceil(filteredData.length / announceData.per_page);
        setCurrentPage(1);
        setFilterType(type);
        setAnnounceData(prev => ({
            ...prev,
            data: filteredData.slice(0, prev.per_page),
            total: type === 'All' ? allAnnouncements.length : filteredData.length,
            last_page: totalPages,
            page: 1
        }));
    };

    // เพิ่ม useEffect สำหรับจัดการ pagination เมื่อ currentPage เปลี่ยน
    useEffect(() => {
        if (filterType !== 'All') {
            const filteredData = getFilteredData();
            const startIndex = (currentPage - 1) * announceData.per_page;
            const endIndex = startIndex + announceData.per_page;
            setAnnounceData(prev => ({
                ...prev,
                data: filteredData.slice(startIndex, endIndex)
            }));
        }
    }, [currentPage, filterType]);

    const formatDateRange = (startDateString, endDateString) => {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        const optionsSameYear = { day: 'numeric', month: 'short' };
        const optionsDifferentYear = { day: 'numeric', month: 'short', year: 'numeric' };

        if (startDate.getFullYear() === endDate.getFullYear()) {
            return `${startDate.toLocaleDateString('en-GB', optionsSameYear)} - ${endDate.toLocaleDateString('en-GB', optionsSameYear)} ${endDate.getFullYear()}`;
        } else {
            return `${startDate.toLocaleDateString('en-GB', optionsDifferentYear)} - ${endDate.toLocaleDateString('en-GB', optionsDifferentYear)}`;
        }
    };

    // แก้ไข handlePageChange function
    const handlePageChange = (pageNumber) => {
        const filteredData = getFilteredData();
        const startIndex = (pageNumber - 1) * announceData.per_page;
        const endIndex = startIndex + announceData.per_page;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        if (paginatedData.length > 0 || pageNumber === 1) {
            setCurrentPage(pageNumber);
            setAnnounceData(prev => ({
                ...prev,
                data: paginatedData,
                page: pageNumber,
                total: filteredData.length,
                last_page: Math.ceil(filteredData.length / prev.per_page)
            }));
        }
    };

    // แก้ไข renderPaginationButtons function
    const renderPaginationButtons = () => {
        const filteredData = getFilteredData();
        const totalPages = Math.ceil(filteredData.length / announceData.per_page);
        const buttons = [];

        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded ${currentPage === i
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                        } border`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    const renderAdminView = () => {
        return (
            <div className="Background">
                <div className="Maincontainer">
                    <div className="mx-8 mb-7">
                        <div className="bg-white rounded-lg shadow-sm p-6 mt-5">
                            <h1 className="font-['DM_Sans'] text-3xl font-semibold text-left leading-[48px]">
                                Administrator Management
                            </h1>
                        </div>

                        {/* Admin dashboard statistics */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="stat-card bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">Total Users</h2>
                                <p className="text-3xl font-bold mt-2">1,234</p>
                            </div>
                            <div className="stat-card bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">Active Scholarships</h2>
                                <p className="text-3xl font-bold mt-2">{checkOpenAnnounce.length}</p>
                            </div>
                            <div className="stat-card bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">Total Applications</h2>
                                <p className="text-3xl font-bold mt-2">567</p>
                            </div>
                        </div>

                        {/* Add more admin-specific content here */}
                    </div>
                </div>
            </div>
        );
    };

    const renderProviderView = () => {
        return (
            <div className="Background">
                <div className="Maincontainer">
                    {/* Existing provider view code */}
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
                                    Post New Scholarship
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
                                <div className="summary-all-border summary-border-radius"> </div>
                                <div className="flex flex-col items-start mt-5">
                                    <h1 className="summary-text">All Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{allAnnouncements.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('Pending')}
                            >
                                <div className="summary-pending-border summary-border-radius"></div>
                                <div className="flex flex-col items-start mt-5 mb-5">
                                    <h1 className="summary-text">Pending Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{checkPendingAnnounce.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('Open')}
                            >
                                <div className="summary-open-border summary-border-radius"></div>
                                <div className="flex flex-col items-start mt-5 mb-5">
                                    <h1 className="summary-text">Opened Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{checkOpenAnnounce.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="border-lightgrey"
                                onClick={() => handleFilterClick('Close')}
                            >
                                <div className="summary-close-border summary-border-radius"></div>
                                <div className="flex flex-col items-start mt-5 mb-5">
                                    <h1 className="summary-text">Closed Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{checkCloseAnnounce.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* No Scholarship Filter */}
                        <div className="mt-10 flex justify-center items-center flex-col">
                            {(filterType === 'All' ? allAnnouncements.length === 0 : getFilteredData().length === 0) && (
                                <>
                                    <h1 className="noscholarship-text">This space is waiting for data</h1>
                                    <img src={image_No_Scholarship} alt="" className="noscholarship" />
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
                                    <div className="grid grid-cols-12 gap-4">
                                        {/* รูปภาพด้านซ้าย */}
                                        <div className="col-span-5">
                                            <img
                                                className='w-[260px] h-[285px] object-cover rounded-lg mt-4'
                                                src={announceImages[announce.id] || image2}
                                                alt={announce.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = image2;
                                                }}
                                            />
                                        </div>

                                        {/* ข้อมูลด้านขวา - ปรับ padding ให้สมดุลกับรูปที่กว้างขึ้น */}
                                        <div className="col-span-7 py-4 pl-4 pr-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <h1 className="number-layout text-sm">
                                                    #{((currentPage - 1) * announceData.per_page + index + 1).toString().padStart(4, '0')}
                                                </h1>
                                                <div
                                                    className={`rounded-md px-3 py-1 ${
                                                        checkPendingAnnounce.some((item) => item.id === announce.id)
                                                            ? 'border-gray-400 bg-gray-100'
                                                            : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                                ? 'open-status'
                                                                : 'border-red-400 bg-red-100'
                                                    }`}
                                                >
                                                    <h1 className={`font-medium text-sm ${
                                                        checkPendingAnnounce.some((item) => item.id === announce.id)
                                                            ? 'text-gray-400'
                                                            : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                                ? 'text-lime-400'
                                                                : 'text-red-400'
                                                    }`}>
                                                        {checkPendingAnnounce.some((item) => item.id === announce.id)
                                                            ? 'Pending'
                                                            : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                                ? 'Open'
                                                                : 'Close'}
                                                    </h1>
                                                </div>
                                            </div>

                                            {/* ส่วนแสดงผล title */}
                                            <div className="space-y-3">
                                                <h1 className="text-lg font-semibold line-clamp-2 text-black">
                                                    {announce?.title || 'Untitled Scholarship'} {/* เพิ่ม fallback text */}
                                                </h1>
                                                
                                                <div>
                                                    <h2 className="font-medium text-sm text-gray-700">Description</h2>
                                                    <p className="text-xs text-gray-500 line-clamp-3 mt-1">
                                                        {announce?.description || 'No description available'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h2 className="font-medium text-sm text-gray-700 mb-1">
                                                        Scholarship period
                                                    </h2>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-blue-600 text-xs">
                                                            {formatDateRange(announce.publish_date, announce.close_date)}
                                                        </span>
                                                        <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md">
                                                            {announce.education_level || 'Not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {getFilteredData().length > announceData.per_page && (
                            <div className="flex justify-center items-center mt-8 mb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 mx-1 rounded ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        } border`}
                                >
                                    Previous
                                </button>
                                {renderPaginationButtons()}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(getFilteredData().length / announceData.per_page)}
                                    className={`px-4 py-2 mx-1 rounded ${currentPage === Math.ceil(getFilteredData().length / announceData.per_page)
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        } border`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const checkUserRole = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwt_decode(token);
                    setUserRole(decoded.role); // Assuming role is stored in token
                } catch (error) {
                    console.error('Error decoding token:', error);
                    setUserRole('provider'); // Default fallback
                }
            } else {
                setUserRole('provider'); // Default fallback
            }
        };

        checkUserRole();
    }, []);

    return (
        <>
            <Nav />
            {isLoading ? (
                <div className="Background">
                    {/* Loading state */}
                </div>
            ) : (
                // Conditional rendering based on role
                <>
                    {['admin', 'superadmin'].includes(userRole)
                        ? renderAdminView()
                        : renderProviderView()
                    }
                </>
            )}
        </>
    );
}

export default Homepage;