import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { Pencil } from "lucide-react";
import { getAvatar, getProfile } from '../composable/getProfile';
import defaultAvatar from '../assets/default-avatar.png';
import jwt_decode from 'jwt-decode';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserRole = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwt_decode(token);
                    setUserRole(decoded.role);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    setUserRole('provider');
                }
            } else {
                setUserRole('provider');
            }
        };

        checkUserRole();
        
        const fetchData = async () => {
            try {
                const profileData = await getProfile();
                setUserData(profileData.profile);
                
                const imageUrl = await getAvatar();
                if (imageUrl) {
                    setAvatarUrl(imageUrl);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setAvatarUrl(null);
            }
        };

        fetchData();

        return () => {
            if (avatarUrl && avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, []);

    const renderAdminProfile = () => (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            {/* Admin Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={avatarUrl || defaultAvatar}
                            alt="Admin Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatar;
                            }}
                        />
                        <div>
                            <h2 className="text-lg font-bold">
                                {userData.first_name && userData.last_name 
                                    ? `${userData.first_name} ${userData.last_name} (Admin name)`
                                    : `${userData.username} (Admin name)`}
                            </h2>
                            <p className="text-sm text-gray-500">{userRole === 'superadmin' ? 'Super Admin' : 'Administrator'}</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">First Name</p>
                            <p className="text-base">{userData.first_name || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Last Name</p>
                            <p className="text-base">{userData.last_name || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="text-base">{userRole === 'superadmin' ? 'Super Admin' : 'Administrator'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-base">{userData.phone_person || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="text-base">{userData.email || 'Not specified'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProviderProfile = () => (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            {/* Company Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={avatarUrl || defaultAvatar}
                            alt="Company Logo"
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatar;
                            }}
                        />
                        <div>
                            <h2 className="text-lg font-bold">
                                {userData.company_name} (Company name)
                            </h2>
                            <p className="text-sm text-gray-500">Provider</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Company Information Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Company Information</h3>
                        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-base">{userData.address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">City</p>
                            <p className="text-base">{userData.city}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Country</p>
                            <p className="text-base">{userData.country}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Postal code</p>
                            <p className="text-base">{userData.postal_code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-base">{userData.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">First Name</p>
                            <p className="text-base">{userData.first_name || 'ยังไม่มีข้อมูล'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Last Name</p>
                            <p className="text-base">{userData.last_name || 'ยังไม่มีข้อมูล'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="text-base">{userData.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-base">{userData.phone_person || 'ยังไม่มีข้อมูล'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="text-base">{userData.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Nav />
            <div className="Background">
                <div className="Maincontainer">
                    {['admin', 'superadmin'].includes(userRole) 
                        ? renderAdminProfile() 
                        : renderProviderProfile()
                    }
                </div>
            </div>
        </>
    );
};

export default Profile;