import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import { Pencil, X, Check, Save, XCircle } from "lucide-react";
import { getAvatar, getProfile, urlProfile } from '../composable/getProfile';
import defaultAvatar from '../assets/default-avatar.png';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import '../style/profile.css';
import '../style/style.css';
import { simpleCountries, getCitiesForCountry } from '../utils/countryData';

// Add validation functions at the top of the file
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

const validateName = (name) => {
    return name.length >= 2 && name.length <= 50;
};

const validatePostalCode = (code) => {
    const re = /^[0-9]{5}$/;
    return re.test(code);
};

const Profile = () => {
    const countryOptions = useMemo(() => {
        return simpleCountries.map(country => ({
            value: country.code,
            label: country.name
        }));
    }, []);

    const [userData, setUserData] = useState({});
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [editAvatar, setEditAvatar] = useState(false);
    const [editPersonal, setEditPersonal] = useState(false);
    const [editCompany, setEditCompany] = useState(false);
    const [formData, setFormData] = useState({});
    const [newAvatar, setNewAvatar] = useState(null);
    const [editName, setEditName] = useState(false);
    const [nameFormData, setNameFormData] = useState({
        company_name: '',
        first_name: '',
        last_name: '',
    });
    const [previousAvatarUrl, setPreviousAvatarUrl] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();

    const getAuthHeaders = (isMultipart = false) => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        };
    };

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
                    setPreviousAvatarUrl(imageUrl);
                }

                // ย้ายการตั้งค่า country/city มาที่นี่ และใช้ข้อมูลจากที่เราสร้างขึ้นเอง
                if (profileData.profile.country) {
                    const country = simpleCountries.find(
                        c => c.name === profileData.profile.country
                    );
                    
                    if (country) {
                        setSelectedCountry({
                            value: country.code,
                            label: country.name
                        });
                        
                        // ใช้ฟังก์ชัน getCitiesForCountry แทน City.getCitiesOfCountry
                        const cityOptions = getCitiesForCountry(country.code).map(city => ({
                            value: city,
                            label: city
                        }));
                        
                        setCities(cityOptions);
                        
                        if (profileData.profile.city) {
                            const cityOption = cityOptions.find(c => c.label === profileData.profile.city);
                            if (cityOption) {
                                setSelectedCity(cityOption);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setAvatarUrl(null);
                setPreviousAvatarUrl(null);
            }
        };

        fetchData();

        return () => {
            if (avatarUrl && avatarUrl.startsWith('blob:')) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, []);

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setNameFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                notify.error("File size must be less than 5MB");
                return;
            }
            
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                notify.error("Please select a valid image file (JPEG, PNG)");
                return;
            }

            setPreviousAvatarUrl(avatarUrl);
            setNewAvatar(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarUrl(previewUrl);
            notify.success("Image selected successfully!");
        }
    };

    // Add notify object if not already defined
    const notify = {
        success: (msg) => toast.success(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light"
        }),
        error: (msg) => toast.error(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light"
        }),
        loading: (msg) => toast.loading(msg, {
            position: "top-right",
            closeOnClick: false,
            closeButton: false,
            theme: "light"
        })
    };

    const handleSaveAvatar = async () => {
        if (!newAvatar) return;
        
        const loadingToastId = notify.loading("Updating avatar...");
        
        try {
            const formData = new FormData();
            formData.append('avatar', newAvatar);
            
            const response = await axios.put(urlProfile, formData, {
                headers: {
                    ...getAuthHeaders(true),
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                toast.dismiss(loadingToastId);
                notify.success("Avatar updated successfully!");
                setEditAvatar(false);
                setNewAvatar(null);
                
                // Wait for 1 second before refreshing
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            toast.dismiss(loadingToastId);
            notify.error(error.response?.data?.message || "Failed to update avatar. Please try again.");
            setAvatarUrl(previousAvatarUrl || defaultAvatar);
        }
    };

    const handleSavePersonal = async () => {
        // ตรวจสอบว่ามี First Name และ Last Name หรือไม่
        if (!formData.first_name || !formData.last_name) {
            notify.error("Please enter both First Name and Last Name before updating other information");
            return;
        }

        // ตรวจสอบความถูกต้องของ First Name และ Last Name
        if (!validateName(formData.first_name)) {
            notify.error("First name must be between 2 and 50 characters");
            return;
        }
        if (!validateName(formData.last_name)) {
            notify.error("Last name must be between 2 and 50 characters");
            return;
        }

        // Validate other personal information
        if (formData.email && !validateEmail(formData.email)) {
            notify.error("Please enter a valid email address");
            return;
        }

        if (formData.phone_number && !validatePhone(formData.phone_number)) {
            notify.error("Please enter a valid 10-digit phone number");
            return;
        }

        // ตรวจสอบว่าถ้ามีการกรอก first_name หรือ last_name อย่างใดอย่างหนึ่ง ต้องกรอกอีกอันด้วย
        if ((formData.first_name && !formData.last_name) || (!formData.first_name && formData.last_name)) {
            notify.error("Please enter both First Name and Last Name");
            return;
        }

        // ถ้ามีการกรอกทั้งคู่ ให้ตรวจสอบความถูกต้อง
        if (formData.first_name && formData.last_name) {
            if (!validateName(formData.first_name)) {
                notify.error("First name must be between 2 and 50 characters");
                return;
            }
            if (!validateName(formData.last_name)) {
                notify.error("Last name must be between 2 and 50 characters");
                return;
            }
        }

        try {
            // ตรวจสอบว่ามีการเปลี่ยนแปลง first_name หรือ last_name หรือไม่
            const nameChanged = (formData.first_name !== userData.first_name) || 
                              (formData.last_name !== userData.last_name);

            // ถ้าไม่มีการกรอกชื่อเลย ให้ส่งค่าเป็น null หรือ empty string
            const dataToUpdate = {
                ...formData,
                first_name: formData.first_name || null,
                last_name: formData.last_name || null
            };

            // Send request to update
            const response = await axios.put(urlProfile, dataToUpdate, {
                headers: getAuthHeaders()
            });

            if (response.data) {
                notify.success("Personal information updated successfully!");
                
                // Update UI
                setUserData(prev => ({
                    ...prev,
                    ...dataToUpdate
                }));
                setEditPersonal(false);

                // รีเฟรชหน้าถ้ามีการเปลี่ยนชื่อ
                if (nameChanged) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        } catch (error) {
            notify.error(error.response?.data?.message || "Failed to update personal information");
            // Revert form data to original values
            setFormData(userData);
        }
    };

    const handleSaveCompany = async () => {
        // ตรวจสอบว่ามี First Name และ Last Name หรือไม่จาก userData
        if (!userData.first_name || !userData.last_name) {
            notify.error("Please enter your First Name and Last Name in Personal Information section before updating company details");
            return;
        }

        // Validate company information
        if (formData.phone && !validatePhone(formData.phone)) {
            notify.error("Please enter a valid 10-digit company phone number");
            return;
        }

        if (formData.postal_code && !validatePostalCode(formData.postal_code)) {
            notify.error("Please enter a valid 5-digit postal code");
            return;
        }

        if (formData.company_name && !validateName(formData.company_name)) {
            notify.error("Company name must be between 2 and 50 characters");
            return;
        }

        try {
            // Update UI immediately
            const updatedData = { ...formData };
            setUserData(prev => ({ ...prev, ...updatedData }));
            setEditCompany(false);

            // Send request in background
            await axios.put(urlProfile, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            notify.success("Company information updated successfully!");
        } catch (error) {
            notify.error("Failed to update company information");
            setUserData(prev => ({ ...prev }));
        }
    };

    const handleSaveName = async () => {
        try {
            // Update UI immediately
            const updatedName = { ...nameFormData };
            setUserData(prev => ({
                ...prev,
                ...updatedName
            }));
            setEditName(false);

            // Send request in background
            await axios.put(urlProfile, nameFormData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            // Add page refresh after successful update
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error updating name:', error);
            // Revert changes if save fails
            setUserData(prev => ({ ...prev }));
        }
    };

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        
        if (selectedOption) {
            // ใช้ฟังก์ชัน getCitiesForCountry แทน City.getCitiesOfCountry
            const cityOptions = getCitiesForCountry(selectedOption.value).map(city => ({
                value: city,
                label: city
            }));
            
            setCities(cityOptions);
            setSelectedCity(null);
            
            setFormData(prev => ({
                ...prev,
                country: selectedOption.label,
                city: ''
            }));
        } else {
            setCities([]);
            setSelectedCity(null);
            
            setFormData(prev => ({
                ...prev,
                country: '',
                city: ''
            }));
        }
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        
        // อัพเดท formData ตามการเลือกเมือง
        setFormData(prev => ({
            ...prev,
            city: selectedOption ? selectedOption.label : ''
        }));
    };

    // ใช้ React.memo หรือ useMemo สำหรับ component ที่มี render ซับซ้อน
    const ActionButton = React.memo(({ onClick, icon: Icon, label, variant = 'primary' }) => {
        const baseStyles = "AllButton";
        const variants = {
            primary: "primary-button",
            success: "success-button",
            danger: "danger-button",
            edit: "edit-button"
        };

        return (
            <button 
                onClick={onClick}
                className={`${baseStyles} ${variants[variant]}`}
            >
                <Icon className="w-4 h-4" />
                {label}
            </button>
        );
    });

    const renderEditButtons = (isEditing, onSave, onCancel, onEdit) => {
        if (isEditing) {
            return (
                <div className="flex gap-2">
                    <ActionButton
                        onClick={onSave}
                        icon={Save}
                        label="Save"
                        variant="success"
                    />
                    <ActionButton
                        onClick={onCancel}
                        icon={XCircle}
                        label="Cancel"
                        variant="danger"
                    />
                </div>
            );
        }
        return (
            <ActionButton
                onClick={onEdit}
                icon={Pencil}
                label="Edit"
                variant="edit"
            />
        );
    };

    const renderAvatarSection = (isAdmin = true) => (
        <div className="relative">
            {editAvatar && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                />
            )}
            <div className="avatarsection-container">
                <div className="relative group">
                    <img
                        src={avatarUrl || defaultAvatar}
                        alt={isAdmin ? "Admin Avatar" : "Company Logo"}
                        className={`w-24 h-24 rounded-full object-cover transition-all duration-200 border-2 ${
                            editAvatar ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                        }}
                    />
                    {editAvatar && (
                        <label 
                            htmlFor="avatar-upload" 
                            className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                        >
                            <Pencil className="w-6 h-6 text-white mb-1" />
                            <span className="text-white text-xs font-medium">Change Photo</span>
                        </label>
                    )}
                </div>
                
                {/* Edit/Save Controls */}
                <div className="mt-4 flex justify-center gap-2">
                    {editAvatar ? (
                        <>
                            {newAvatar && (
                                <button
                                    onClick={handleSaveAvatar}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setEditAvatar(false);
                                    setNewAvatar(null);
                                    setAvatarUrl(previousAvatarUrl || defaultAvatar);
                                }}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors duration-200"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditAvatar(true)}
                            className="editphoto-button"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Photo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderLocationFields = () => {
        if (editCompany) {
            return (
                <>
                    <div>
                        <label className="text-sm text-gray-500">Country</label>
                        <Select
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            options={countryOptions}
                            className="w-full"
                            placeholder="Select Country"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">City</label>
                        <Select
                            value={selectedCity}
                            onChange={handleCityChange}
                            options={cities}
                            className="w-full"
                            placeholder="Select City"
                            isDisabled={!selectedCountry}
                            isClearable
                        />
                    </div>
                </>
            );
        }
        return (
            <>
                <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-base">{userData.country || 'Not specified'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-base">{userData.city || 'Not specified'}</p>
                </div>
            </>
        );
    };

    const renderAdminProfile = () => (
        <div className="p-8">
            <h1 className="profile-font mb-6">My Profile</h1>
            <div className="bg-white rounded-lg mb-8 border p-4">
                <div className="profilecontainer">
                    {renderAvatarSection(true)}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col gap-2">
                            <h2 className="name-font">
                                {userData.first_name && userData.last_name 
                                    ? `${userData.first_name} ${userData.last_name} (Admin name)`
                                    : `${userData.username} (Admin name)`}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {userRole === 'superadmin' ? 'Super Admin' : 'Administrator'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of the admin profile rendering */}
            <div className="bg-white rounded-lg border p-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 subhead-font">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        {renderEditButtons(
                            editPersonal,
                            handleSavePersonal,
                            () => setEditPersonal(false),
                            () => {
                                setEditPersonal(true);
                                setFormData(userData);
                            }
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4">
                        {editPersonal ? (
                            <>
                                <div>
                                    <label className="maininfo-sub-font">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="maininfo-sub-font">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="maininfo-sub-font">Phone</label>
                                    <input
                                        type="text"
                                        name="phone_number" 
                                        value={formData.phone_number || ''} 
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="maininfo-sub-font">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
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
                                    <p className="text-base">{userData.phone_number || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="text-base">{userData.email || 'Not specified'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProviderProfile = () => (
        <div className="p-8">
             <h1 className="profile-font mb-6">My Profile</h1>

            {/* Company Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        {renderAvatarSection(false)}
                        <div>
                            {editName ? (
                                <input
                                    type="text"
                                    name="company_name"
                                    value={nameFormData.company_name}
                                    onChange={handleNameChange}
                                    placeholder="Company Name"
                                    className="name-font rounded focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                />
                            ) : (
                                <h2 className="name-font">
                                    {userData.company_name} (Company name)
                                </h2>
                            )}
                            <p className="text-sm text-gray-500 mt-2">Provider</p>
                        </div>
                    </div>
                    {renderEditButtons(
                        editName,
                        handleSaveName,
                        () => {
                            setEditName(false);
                            setNameFormData({
                                company_name: userData.company_name || '',
                            });
                        },
                        () => {
                            setEditName(true);
                            setNameFormData({
                                company_name: userData.company_name || '',
                            });
                        }
                    )}
                </div>
            </div>

            {/* Company Information Section */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 subhead-font">
                        <h3 className="text-lg font-semibold">Company Information</h3>
                        {renderEditButtons(
                            editCompany,
                            handleSaveCompany,
                            () => setEditCompany(false),
                            () => {
                                setEditCompany(true);
                                setFormData(userData);
                            }
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {editCompany ? (
                            <>
                                <div>
                                    <label className="text-sm text-gray-500">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                                {/* แทนที่ input ของ Country และ City ด้วย Select components */}
                                <div>
                                    <label className="text-sm text-gray-500">Country</label>
                                    <Select
                                        value={selectedCountry}
                                        onChange={handleCountryChange}
                                        options={countryOptions}
                                        className="w-full rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                        placeholder="Select Country"
                                        isClearable
                                         styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                minHeight: '42px',
                                                border: state.isFocused ? '1px solid #C0CDFF' : '1px solid #e2e8f0',  // สีขอบเมื่อ focus
                                                boxShadow: state.isFocused ? '0px 0px 0px 4px rgba(108, 99, 255, 0.15)' : 'none', // เงาฟ้าเมื่อ focus
                                                '&:hover': {
                                                    borderColor: state.isFocused ? '#C0CDFF' : '#e2e8f0',  // สีขอบเมื่อ hover
                                                }
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#94a3b8', // สีของ placeholder
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: 'black', // สีของตัวเลือกที่ถูกเลือก
                                            }),
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">City</label>
                                    <Select
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        options={cities}
                                        className="w-full mt-2"
                                        placeholder="Select City"
                                        isDisabled={!selectedCountry}
                                        isClearable
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                minHeight: '42px',
                                                border: state.isFocused ? '1px solid #C0CDFF' : '1px solid #e2e8f0',  // สีขอบเมื่อ focus
                                                boxShadow: state.isFocused ? '0px 0px 0px 4px rgba(108, 99, 255, 0.15)' : 'none', // เงาฟ้าเมื่อ focus
                                                '&:hover': {
                                                    borderColor: state.isFocused ? '#C0CDFF' : '#e2e8f0',  // สีขอบเมื่อ hover
                                                }
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#94a3b8', // สีของ placeholder
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: 'black', // สีของตัวเลือกที่ถูกเลือก
                                            }),
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Postal code</label>
                                    <input
                                        type="text"
                                        name="postal_code"
                                        value={formData.postal_code || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500 mt-1">Address</p>
                                    <p className="text-base mt-5 mb-4">{userData.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mt-1">Country</p>
                                    <p className="text-base mt-5 mb-4">{userData.country}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">City</p>
                                    <p className="text-base mt-5">{userData.city}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Postal code</p>
                                    <p className="text-base mt-5">{userData.postal_code}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mt-3">Phone</p>
                                    <p className="text-base mt-5">{userData.phone}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* แนะนำให้กรอก Personal Information ก่อนถ้ายังไม่มี First Name และ Last Name */}
            {(!userData.first_name || !userData.last_name) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Please complete your personal information (First Name and Last Name) before updating other details.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 subhead-font">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        {renderEditButtons(
                            editPersonal,
                            handleSavePersonal,
                            () => setEditPersonal(false),
                            () => {
                                setEditPersonal(true);
                                setFormData(userData);
                            }
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {editPersonal ? (
                            <>
                                <div>
                                    <label className="text-sm text-gray-500">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Phone</label>
                                    <input
                                        type="text"
                                        name="phone_person"
                                        value={formData.phone_person || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-2 border rounded p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">First Name</p>
                                    <p className="text-base">{userData.first_name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Name</p>
                                    <p className="text-base">{userData.last_name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-base">{userData.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-base">{userData.phone_person || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="text-base">{userData.email}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Add ToastContainer to the render
    return (
        <>
            <Nav />
            <ToastContainer />
            <div className="Background">
                <div className="ProfileContainer">
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