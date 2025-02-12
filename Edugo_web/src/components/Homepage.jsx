import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import icon from '../assets/Vector.svg';
import image2 from '../assets/bg-file-image.png';
import { useNavigate } from 'react-router-dom';
import { getAnnounce, getAnnounceImage } from '../composable/getAnnounce';
import image_No_Scholarship from '../assets/No_Scholarship.png';
import '../style/style.css'; // Import CSS file
import '../style/home.css'; // Import CSS file
import jwt_decode from 'jwt-decode'; // Make sure to import jwt-decode

const mockData = [
    {
        id: 1,
        name: "Engineering Scholarship 2024",
        appointment: "2024-03-15",
        email: "contact@engineering.edu",
        status: "Approved"
    },
    {
        id: 2,
        name: "Medical Studies Grant",
        appointment: "2024-03-20",
        email: "med.scholarship@health.org",
        status: "Pending"
    },
    {
        id: 3,
        name: "Arts & Design Fellowship",
        appointment: "2024-03-25",
        email: "arts@creative.edu",
        status: "Rejected"
    },
    {
        id: 4,
        name: "Business Excellence Award",
        appointment: "2024-04-01",
        email: "business@corp.edu",
        status: "Approved"
    },
    {
        id: 5,
        name: "Science Research Grant",
        appointment: "2024-04-05",
        email: "science@research.org",
        status: "Pending"
    }
];

const statusColors = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800"
};

const itemsPerPage = 5;
const totalPages = Math.ceil(mockData.length / itemsPerPage);

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
    const [displayedData] = useState(mockData);
    const [activeTab, setActiveTab] = useState('scholarships');
    const [adminCurrentPage, setAdminCurrentPage] = useState(1);
    const [adminItemsPerPage] = useState(10);
    const [adminAnnounceData, setAdminAnnounceData] = useState({
        data: [],
        total: 0,
        page: 1,
        last_page: 1,
        per_page: 10
    });

    const fetchAllAnnouncements = async (page = 1) => {
        try {
            const response = await getAnnounce(page);
            if (response) {
                setAdminAnnounceData(response);
                setAllAnnouncements(prev => {
                    // หากเป็นหน้าแรก ให้แทนที่ข้อมูลทั้งหมด
                    if (page === 1) {
                        return response.data;
                    }
                    // หากเป็นหน้าอื่นๆ ให้เพิ่มข้อมูลต่อท้าย
                    return [...prev, ...response.data];
                });
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
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

    const handleAdminPageChange = (newPage) => {
        setAdminCurrentPage(newPage);
    };

    const renderAdminView = () => {
        const tableContent = () => {
            if (activeTab === 'approvals') {
                return (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {displayedData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.appointment}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[item.status]}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }

            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Education Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {adminAnnounceData.data.map((announce, index) => {
                            const status = checkPendingAnnounce.some(item => item.id === announce.id)
                                ? 'Pending'
                                : checkOpenAnnounce.some(item => item.id === announce.id)
                                    ? 'Open'
                                    : 'Close';

                            const startIndex = (adminAnnounceData.page - 1) * adminAnnounceData.per_page;

                            return (
                                <tr key={announce.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{announce.title}</div>
                                        <div className="text-sm text-gray-500 line-clamp-1">{announce.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateRange(announce.publish_date, announce.close_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md">
                                            {announce.education_level || 'Not specified'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            status === 'Open' ? 'bg-green-100 text-green-800' :
                                            status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button 
                                            onClick={() => navigate(`/detail/${announce.id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        };

        const renderAdminPagination = () => {
            if (!adminAnnounceData || adminAnnounceData.last_page <= 1) return null;

            return (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => handleAdminPageChange(adminCurrentPage - 1)}
                                disabled={adminCurrentPage === 1}
                                className={`px-4 py-2 mx-1 rounded ${
                                    adminCurrentPage === 1
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                } border`}
                            >
                                Previous
                            </button>
                            {[...Array(adminAnnounceData.last_page)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handleAdminPageChange(i + 1)}
                                    className={`px-4 py-2 mx-1 rounded ${
                                        adminCurrentPage === i + 1
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    } border`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handleAdminPageChange(adminCurrentPage + 1)}
                                disabled={adminCurrentPage === adminAnnounceData.last_page}
                                className={`px-4 py-2 mx-1 rounded ${
                                    adminCurrentPage === adminAnnounceData.last_page
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                } border`}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            );
        };

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Administrator Management</h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="border-b border-gray-200 bg-gray-50">
                            <div className="px-6 py-4">
                                <nav className="flex space-x-4">
                                    <button 
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                                            activeTab === 'approvals' 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setActiveTab('approvals')}
                                    >
                                        Approval Management
                                    </button>
                                    <button 
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                                            activeTab === 'scholarships' 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setActiveTab('scholarships')}
                                    >
                                        Scholarship Management
                                    </button>
                                </nav>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {tableContent()}
                        </div>
                        {renderAdminPagination()}
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
                                                className='scholarship-cover'
                                                src={announceImages[announce.id] || image2}
                                                alt={announce.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = image2;
                                                }}
                                            />
                                        </div>

                                        {/* ข้อมูลด้านขวา - ปรับ padding ให้สมดุลกับรูปที่กว้างขึ้น */}
                                        <div className="col-span-7 pl-12 pr-2">
                                            <div className="flex justify-between items-center">
                                                <h1 className="number-layout text-sm">
                                                    #{((currentPage - 1) * announceData.per_page + index + 1).toString().padStart(4, '0')}
                                                </h1>
                                                <div
                                                    className={`rounded-md px-3 py-1 ${checkPendingAnnounce.some((item) => item.id === announce.id)
                                                        ? 'pending-status'
                                                        : checkOpenAnnounce.some((item) => item.id === announce.id)
                                                            ? 'open-status'
                                                            : 'close-status'
                                                        }`}
                                                >
                                                    <h1 className={`font-medium text-sm ${checkPendingAnnounce.some((item) => item.id === announce.id)
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
                                                <h1 className="headingclamp">
                                                    {announce?.title || 'Untitled Scholarship'} {/* เพิ่ม fallback text */}
                                                </h1>

                                                <div>
                                                    <h2 className="font-medium text-sm text-gray-700 pt-1 ">Description</h2>
                                                    <p className="descriptionclamp">
                                                        {announce?.description || 'No description available'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h2 className="font-medium text-sm text-gray-700 mb-1 mt-6">
                                                        Scholarship period
                                                    </h2>
                                                        <span className="date-period-layout">
                                                            {formatDateRange(announce.publish_date, announce.close_date)}
                                                        </span>
                                                        <span className="educational-level-status mt-4">
                                                            {announce.education_level || 'Not specified'}
                                                        </span>
                                                    
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

    useEffect(() => {
        if (activeTab === 'scholarships') {
            fetchAllAnnouncements(adminCurrentPage);
        }
    }, [adminCurrentPage, activeTab]);

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