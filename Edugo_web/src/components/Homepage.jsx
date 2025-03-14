import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import icon from '../assets/Vector.svg';
import image2 from '../assets/bg-file-image.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAnnounce, getAnnounceImage } from '../composable/getAnnounce';
import { getProvider } from '../composable/getProvider'; // เพิ่มการนำเข้า getProvider
import image_No_Scholarship from '../assets/No_Scholarship.png';
import '../style/style.css'; // Import CSS file
import '../style/home.css'; // Import CSS file
import jwt_decode from 'jwt-decode'; // Make sure to import jwt-decode

const statusColors = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Waiting: "bg-blue-100 text-blue-800"
};

const itemsPerPage = 5;

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
    // เปลี่ยนค่าเริ่มต้นของ activeTab เป็น 'approvals' แทน 'scholarships'
    const [activeTab, setActiveTab] = useState('approvals');
    const [adminCurrentPage, setAdminCurrentPage] = useState(1);
    const [adminItemsPerPage] = useState(10);
    const [adminAnnounceData, setAdminAnnounceData] = useState({
        data: [],
        total: 0,
        page: 1,
        last_page: 1,
        per_page: 10
    });
    // เพิ่ม state สำหรับเก็บข้อมูลผู้ให้บริการจาก API
    const [providerData, setProviderData] = useState([]);
    // เพิ่มตัวแปรสำหรับการจัดการหน้าในส่วนของ provider
    const [providerCurrentPage, setProviderCurrentPage] = useState(1);
    // แก้ไขค่า providersPerPage ให้เหมือนกับ limit ที่เราส่งไป API
    const providersPerPage = 10;

    // ใช้สำหรับคำนวณจำนวนหน้าทั้งหมดของ provider
    const totalProviderPages = Math.ceil((providerData?.length || 0) / providersPerPage);

    // เพิ่ม state สำหรับเก็บข้อมูลการแบ่งหน้า (pagination) ของ provider
    const [providerPagination, setProviderPagination] = useState({
        limit: 10,
        page: 1,
        total: 0,
        total_page: 1
    });

    // Add state for storing all providers (across all pages)
    const [allProviders, setAllProviders] = useState([]);
    
    // Add state for actual counts
    const [approvalsCount, setApprovalsCount] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    // Keep a reference to the total counts separately from the regular API response
    const [providerCounts, setProviderCounts] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        initialized: false
    });

    // ฟังก์ชั่นดึงข้อมูลผู้ให้บริการ
    const fetchProviderData = async () => {
        try {
            const response = await getProvider(providerCurrentPage, providersPerPage);
            
            if (response && response.data) {
                setProviderData(response.data);
                
                if (response.pagination) {
                    setProviderPagination(response.pagination);
                    
                    // If we haven't calculated counts yet, do it now
                    if (!providerCounts.initialized) {
                        // This will trigger the fetchAllProviders effect
                        setProviderCounts(prev => ({ ...prev, initialized: true }));
                    }
                }
            } else {
                setProviderData([]);
                // Set default pagination values to ensure UI elements still work
                setProviderPagination({
                    limit: providersPerPage,
                    page: 1,
                    total: 0,
                    total_page: 1,
                    pending_count: 0,
                    approved_count: 0,
                    rejected_count: 0
                });
            }
        } catch (error) {
            console.error('Error fetching provider data:', error);
            setProviderData([]);
            // Set default pagination values in case of error
            setProviderPagination({
                limit: providersPerPage,
                page: 1, 
                total: 0,
                total_page: 1,
                pending_count: 0,
                approved_count: 0,
                rejected_count: 0
            });
        }
    };

    // New effect to fetch data for counting across all pages when needed
    useEffect(() => {
        const fetchAllProviders = async () => {
            try {
                // Only proceed if we are on the approvals tab and the counts need initializing
                if (activeTab !== 'approvals' || !providerCounts.initialized) return;
                
                // Get total pages from pagination
                const totalPages = providerPagination.total_page || 1;
                const allProviders = [];
                
                // Fetch data from all pages (up to reasonable limit)
                const maxPages = Math.min(totalPages, 5); // Limit to first 5 pages
                
                for (let i = 1; i <= maxPages; i++) {
                    // Skip the current page since we already have that data
                    if (i === providerCurrentPage) {
                        allProviders.push(...providerData);
                        continue;
                    }
                    
                    const pageResponse = await getProvider(i, providersPerPage);
                    if (pageResponse && pageResponse.data) {
                        allProviders.push(...pageResponse.data);
                    }
                }
                
                // Count providers by status
                const pendingCount = allProviders.filter(p => p.verify === 'Waiting').length;
                const approvedCount = allProviders.filter(p => p.verify === 'Yes').length;
                const rejectedCount = allProviders.filter(p => p.verify === 'No').length;
                const totalCount = pendingCount + approvedCount + rejectedCount;
                
                // Update the counts
                setProviderCounts({
                    total: totalCount,
                    pending: pendingCount,
                    approved: approvedCount,
                    rejected: rejectedCount,
                    initialized: true
                });
                
            } catch (error) {
                console.error("Error fetching all providers:", error);
                // Keep initialized true to prevent infinite retries
                setProviderCounts(prev => ({ ...prev, initialized: true }));
            }
        };
        
        fetchAllProviders();
    }, [providerCounts.initialized, activeTab, providerPagination.total_page]);

    // New function to fetch all provider pages for accurate counts
    const fetchAllProviderPages = async (totalPages) => {
        try {
            const allResults = [];
            const pagePromises = [];
            
            // Fetch page 1 to totalPages (with a reasonable limit)
            const maxPagesToFetch = Math.min(totalPages, 10); // Limit to 10 pages max
            
            for (let i = 1; i <= maxPagesToFetch; i++) {
                // Skip current page as we already have it
                if (i === providerCurrentPage) continue;
                
                pagePromises.push(
                    getProvider(i, providersPerPage)
                        .then(res => {
                            if (res && res.data) {
                                return res.data;
                            }
                            return [];
                        })
                );
            }
            
            const results = await Promise.all(pagePromises);
            results.forEach(pageData => {
                allResults.push(...pageData);
            });
            
            // Add current page data
            allResults.push(...providerData);
            
            // Remove duplicates using provider IDs
            const uniqueProviders = Array.from(
                new Map(allResults.map(item => [item.id, item])).values()
            );
            
            setAllProviders(uniqueProviders);
            
            // Calculate total counts from all providers
            const pendingCount = uniqueProviders.filter(p => p.verify === 'Waiting').length;
            const approvedCount = uniqueProviders.filter(p => p.verify === 'Yes').length;
            const rejectedCount = uniqueProviders.filter(p => p.verify === 'No').length;
            const totalCount = uniqueProviders.length;
            
            setApprovalsCount({
                total: totalCount,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            });
            
        } catch (error) {
            console.error('Error fetching all provider pages:', error);
        }
    };

    // ดึงข้อมูลผู้ให้บริการเมื่อ tab เป็น approvals
    useEffect(() => {
        if (activeTab === 'approvals') {
            fetchProviderData();
        }
    }, [activeTab, providerCurrentPage]); // เพิ่ม providerCurrentPage เพื่อโหลดข้อมูลใหม่เมื่อมีการเปลี่ยนหน้า

    // อัพเดทฟังก์ชันสำหรับการจัดการเปลี่ยนหน้า
    const handleProviderPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= providerPagination.total_page) {
            setProviderCurrentPage(newPage);
        }
    };

    // อัพเดทฟังก์ชัน getCurrentPageProviders
    const getCurrentPageProviders = () => {
        return providerData || [];
    };

    // อัปเดตฟังก์ชัน renderProviderPagination ให้ใช้ providerPagination.total_page แทน totalProviderPages
    const renderProviderPagination = () => {
        // Always make sure the pagination component renders
        return (
            <div className="bg-white px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex justify-center flex-1">
                        <nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handleProviderPageChange(1)}
                                disabled={providerCurrentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium ${
                                    providerCurrentPage === 1 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                            >
                                <span className="sr-only">First</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {(() => {
                                let pages = [];
                                const totalPages = Math.max(1, providerPagination.total_page); // Ensure at least 1 page
                                
                                // Always show at least one page button
                                if (totalPages === 1) {
                                    pages.push(
                                        <button
                                            key={1}
                                            onClick={() => handleProviderPageChange(1)}
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium mx-1 rounded-md bg-blue-600 text-white transition-colors duration-150"
                                        >
                                            1
                                        </button>
                                    );
                                    return pages;
                                }
                                
                                let startPage = Math.max(1, providerCurrentPage - 2);
                                let endPage = Math.min(totalPages, startPage + 4);
                                
                                if (endPage - startPage < 4) {
                                    startPage = Math.max(1, endPage - 4);
                                }
                                
                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => handleProviderPageChange(i)}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium mx-1 rounded-md
                                                ${providerCurrentPage === i 
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                } transition-colors duration-150`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }
                                return pages;
                            })()}

                            <button
                                onClick={() => handleProviderPageChange(Math.max(1, providerPagination.total_page))}
                                disabled={providerCurrentPage === providerPagination.total_page || providerPagination.total_page <= 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium ${
                                    providerCurrentPage === providerPagination.total_page || providerPagination.total_page <= 1
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                            >
                                <span className="sr-only">Last</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-nowrap">
                        Showing {providerData.length > 0 ? ((providerCurrentPage - 1) * providersPerPage) + 1 : (providerPagination.total > 0 ? 1 : 0)} to {providerData.length > 0 ? Math.min(providerCurrentPage * providersPerPage, providerPagination.total) : providerPagination.total} of {providerPagination.total || 0} results
                    </div>
                </div>
            </div>
        );
    };

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
        // ถ้าเป็น tab approvals เราจะโหลดข้อมูลผู้ให้บริการ
        if (activeTab === 'approvals') {
            fetchProviderData()
                .then(() => setIsLoading(false))
                .catch((error) => {
                    console.error('Error fetching provider data:', error);
                    setIsLoading(false);
                });
        } else {
            // ถ้าเป็น tab scholarships เราจะโหลดข้อมูลทุนการศึกษา (เหมือนเดิม)
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
        }
    }, [currentPage, activeTab]);

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
    // รับค่า state จาก location หากมี
    const location = useLocation(); // เพิ่มการนำเข้า useLocation
    
    // เพิ่ม useEffect นี้เป็นตัวแรกในคอมโพเนนต์ เพื่อให้มันทำงานก่อน
    useEffect(() => {
        // ตั้งค่า initial state จาก localStorage เมื่อคอมโพเนนต์ถูกโหลด
        const savedTab = localStorage.getItem('activeAdminTab');
        if (savedTab) {
            setActiveTab(savedTab);
        }
        
        // ตรวจสอบ hash
        if (location.hash === '#scholarships') {
            setActiveTab('scholarships');
        } else if (location.hash === '#approvals') {
            setActiveTab('approvals');
        }
    }, []);

    // แก้ไข useEffect เดิมที่ตรวจสอบ state จาก navigation
    useEffect(() => {
        if (location.state && location.state.activeTab) {
            console.log("Setting active tab to:", location.state.activeTab);
            setActiveTab(location.state.activeTab);
            // บันทึกค่า activeTab ไว้ใน localStorage
            localStorage.setItem('activeAdminTab', location.state.activeTab);
            // เคลียร์ state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // เพิ่ม useEffect ใหม่เพื่อบันทึกค่า activeTab เมื่อมีการเปลี่ยนแปลง
    useEffect(() => {
        // บันทึกค่า activeTab ไว้ใน localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
        if (userRole && ['admin', 'superadmin'].includes(userRole)) {
            localStorage.setItem('activeAdminTab', activeTab);
        }
    }, [activeTab, userRole]);

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
    // เพิ่มฟังก์ชันสำหรับจัดรูปแบบวันที่
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        
        const date = new Date(dateString);
        // ตรวจสอบว่าวันที่ถูกต้องหรือไม่
        if (isNaN(date.getTime())) return "Invalid date";
        
        // สร้างรูปแบบวันที่เป็น "24 Jan 2025"
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const renderAdminView = () => {
        const tableContent = () => {
            if (activeTab === 'approvals') {
                // กรณีที่ยังไม่มีข้อมูล - เปลี่ยนเป็นภาษาอังกฤษ
                if (!providerData || providerData.length === 0) {
                    return (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No provider information found</p>
                        </div>
                    );
                }

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
                            {getCurrentPageProviders().map((provider, index) => {
                                // แปลงค่า verify เป็นสถานะที่แสดงผล
                                let status;
                                switch(provider.verify) {
                                    case 'Yes':
                                        status = "Approved";
                                        break;
                                    case 'No':
                                        status = "Rejected";
                                        break;
                                    case 'Waiting':
                                    default:
                                        status = "Pending";
                                        break;
                                }
                                // แก้การคำนวณลำดับเพื่อให้ถูกต้องกับการแบ่งหน้า
                                const startIndex = (providerCurrentPage - 1) * providersPerPage;
                                
                                return (
                                    <tr key={provider.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {provider.name || provider.company_name || "Not specified"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(provider.create_on)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {provider.email || "Not specified"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status]}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                onClick={() => navigate(`/provider/detail/${provider.id}`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                <div className="bg-white px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex justify-center flex-1">
                            <nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
                                {/* Copy the same button structure as renderProviderPagination but use adminCurrentPage and handleAdminPageChange */}
                                <button
                                    onClick={() => handleAdminPageChange(1)}
                                    disabled={adminCurrentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium ${
                                        adminCurrentPage === 1 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                >
                                    <span className="sr-only">First</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Page numbers */}
                                {(() => {
                                    let pages = [];
                                    let startPage = Math.max(1, adminCurrentPage - 2);
                                    let endPage = Math.min(adminAnnounceData.last_page, startPage + 4);
                                    
                                    if (endPage - startPage < 4) {
                                        startPage = Math.max(1, endPage - 4);
                                    }
                                    
                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => handleAdminPageChange(i)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium mx-1 rounded-md
                                                    ${adminCurrentPage === i 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                    } transition-colors duration-150`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pages;
                                })()}

                                <button
                                    onClick={() => handleAdminPageChange(adminAnnounceData.last_page)}
                                    disabled={adminCurrentPage === adminAnnounceData.last_page}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium ${
                                        adminCurrentPage === adminAnnounceData.last_page 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                >
                                    <span className="sr-only">Last</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-nowrap">
                            Showing {adminAnnounceData.data.length > 0 ? ((adminCurrentPage - 1) * adminAnnounceData.per_page) + 1 : 0} to {Math.min(adminCurrentPage * adminAnnounceData.per_page, adminAnnounceData.total)} of {adminAnnounceData.total} results
                        </div>
                    </div>
                </div>
            );
        };

        // Compute total counts when API doesn't provide them
        const waitingCount = providerData.filter(p => p.verify === 'Waiting').length;
        const approvedCount = providerData.filter(p => p.verify === 'Yes').length;
        const rejectedCount = providerData.filter(p => p.verify === 'No').length;
        
        // Get actual counts from providerPagination if available, otherwise use calculated values
        const totalCount = providerCounts.total > 0 ? providerCounts.total : providerPagination.total;
        const pendingCount = providerCounts.pending;
        const yesCount = providerCounts.approved;
        const noCount = providerCounts.rejected;

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Administrator Management</h1>
                    </div>

                    {/* Update the approval cards styling with left borders */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex">
                            <div className="w-2 bg-gray-500"></div>
                            <div className="p-4 flex-1">
                                <h2 className="text-sm font-medium text-gray-600">All Approval</h2>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {totalCount}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-600">Approval</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex">
                            <div className="w-2 bg-yellow-500"></div>
                            <div className="p-4 flex-1">
                                <h2 className="text-sm font-medium text-gray-600">Pending Approval</h2>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {pendingCount}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-600">Approval</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex">
                            <div className="w-2 bg-green-500"></div>
                            <div className="p-4 flex-1">
                                <h2 className="text-sm font-medium text-gray-600">Approved Approval</h2>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {yesCount}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-600">Approval</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex">
                            <div className="w-2 bg-red-500"></div>
                            <div className="p-4 flex-1">
                                <h2 className="text-sm font-medium text-gray-600">Rejected Approval</h2>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {noCount}
                                    </p>
                                    <p className="ml-2 text-sm text-gray-600">Approval</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rest of the component */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="border-b border-gray-200 bg-gray-50">
                            <div className="px-6 py-4">
                                <nav className="flex justify-between items-center">
                                    <div className="flex space-x-4">
                                        <button
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'approvals'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setActiveTab('approvals');
                                                window.history.replaceState(null, '', '/#approvals');
                                            }}
                                        >
                                            Approval Management
                                        </button>
                                        <button
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'scholarships'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setActiveTab('scholarships');
                                                window.history.replaceState(null, '', '/#scholarships');
                                            }}
                                        >
                                            Scholarship Management
                                        </button>
                                        <button
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'users'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setActiveTab('users');
                                                window.history.replaceState(null, '', '/#users');
                                            }}
                                        >
                                            User Management
                                        </button>
                                    </div>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150">
                                        Add New Administrator
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Rest of the table content */}
                        <div className="overflow-x-auto">
                            {tableContent()}
                        </div>

                        {activeTab === 'approvals' ? renderProviderPagination() : renderAdminPagination()}
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
                    </div>

                    {/* Buttons for Filter */}
                    <div className="summary-padding">
                        <div
                            className="border-lightgrey"
                            onClick={() => handleFilterClick('All')}
                        >
                            <div className="summary-all-border summary-border-radius">
                                <div className="flex flex-col items-start mt-5">
                                    <h1 className="summary-text">All Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{allAnnouncements.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="border-lightgrey"
                            onClick={() => handleFilterClick('Pending')}
                        >
                            <div className="summary-pending-border summary-border-radius">
                                <div className="flex flex-col items-start mt-5 mb-5">
                                    <h1 className="summary-text">Pending Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{checkPendingAnnounce.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="border-lightgrey"
                            onClick={() => handleFilterClick('Open')}
                        ></div>
                            <div className="summary-open-border summary-border-radius">
                                <div className="flex flex-col items-start mt-5 mb-5">
                                    <h1 className="summary-text">Opened Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{checkOpenAnnounce.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="border-lightgrey"
                            onClick={() => handleFilterClick('Close')}
                        >
                            <div className="summary-close-border summary-border-radius">
                                <div className="flex flex-col items-start mt-5 mb-5">
                                    <h1 className="summary-text">Closed Scholarship</h1>
                                    <div className="flex flex-row items-center mt-2 ml-8">
                                        <h1 className="text-3xl font-bold">{checkCloseAnnounce.length}</h1>
                                        <h1 className="scholarshiptextsum">Scholarship</h1>
                                    </div>
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
                        <div className="flex justify-center items-center mt-8 mb-12 px-4 py-5">
                            <nav className="relative z-0 inline-flex rounded-md shadow-lg -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'}`}
                                    title="หน้าแรก"
                                >
                                    <span className="sr-only">หน้าแรก</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-3 py-2 border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'}`}
                                    title="ก่อนหน้า"
                                >
                                    <span className="sr-only">ก่อนหน้า</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {/* แสดงปุ่มเลขหน้าแบบสมาร์ท */}
                                {(() => {
                                    let pages = [];
                                    const totalPages = Math.ceil(getFilteredData().length / announceData.per_page);
                                    let startPage = Math.max(1, currentPage - 2);
                                    let endPage = Math.min(totalPages, startPage + 4);
                                    
                                    // ปรับ startPage ถ้า endPage ชนขอบด้านขวา
                                    if (endPage - startPage < 4) {
                                        startPage = Math.max(1, endPage - 4);
                                    }
                                    
                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                                                    currentPage === i 
                                                    ? 'z-10 bg-blue-600 border-blue-600 text-white' 
                                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pages;
                                })()}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(getFilteredData().length / announceData.per_page)}
                                    className={`relative inline-flex items-center px-3 py-2 border ${
                                        currentPage === Math.ceil(getFilteredData().length / announceData.per_page) 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'
                                    }`}
                                    title="ถัดไป"
                                >
                                    <span className="sr-only">ถัดไป</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handlePageChange(Math.ceil(getFilteredData().length / announceData.per_page))}
                                    disabled={currentPage === Math.ceil(getFilteredData().length / announceData.per_page)}
                                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                                        currentPage === Math.ceil(getFilteredData().length / announceData.per_page) 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'
                                    }`}
                                    title="หน้าสุดท้าย"
                                >
                                    <span className="sr-only">หน้าสุดท้าย</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
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
        if (activeTab === 'scholarships' && !isLoading) {
            fetchAllAnnouncements(adminCurrentPage);
        }
    }, [adminCurrentPage, activeTab, isLoading]);

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