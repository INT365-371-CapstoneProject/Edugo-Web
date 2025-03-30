import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Swal from 'sweetalert2';
import axios from 'axios';
const APT_ROOT = import.meta.env.VITE_API_ROOT;

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    // แก้ไขให้มีค่าเริ่มต้นเป็น string ว่างแทน undefined
    const [formData, setFormData] = useState({
        account_id: parseInt(id),
        username: '',  // กำหนดค่าเริ่มต้นเป็น string ว่าง
        email: '',    // กำหนดค่าเริ่มต้นเป็น string ว่าง
        password: ''  // กำหนดค่าเริ่มต้นเป็น string ว่าง
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [originalData, setOriginalData] = useState(null);

    // โหลดข้อมูลผู้ใช้เมื่อเข้าหน้า
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(`${APT_ROOT}/api/admin/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (data.id) {
                    const userData = {
                        account_id: parseInt(id),
                        username: data.username || '',  // ใส่ fallback เป็น string ว่าง
                        email: data.email || '',       // ใส่ fallback เป็น string ว่าง
                        password: ''                   // รักษาค่าว่างไว้สำหรับ password
                    };
                    setFormData(userData);
                    setOriginalData(userData); // เก็บข้อมูลเดิมไว้เปรียบเทียบ
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.response?.data?.message || 'Failed to load user data');
            }
        };
        fetchUserData();
    }, [id]);

    // เพิ่มฟังก์ชัน checkDataChanged สำหรับตรวจสอบการเปลี่ยนแปลง
    const checkDataChanged = () => {
        if (!originalData) return false;
        
        // ตรวจสอบการเปลี่ยนแปลงของ username และ email
        const hasBasicChanges = 
            formData.username !== originalData.username ||
            formData.email !== originalData.email;

        // ตรวจสอบว่ามีการกรอกรหัสผ่านใหม่หรือไม่
        const hasPasswordChange = formData.password.trim().length > 0;

        return hasBasicChanges || hasPasswordChange;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
        if (!checkDataChanged()) {
            Swal.fire({
                title: 'No Changes',
                text: 'No data has been modified',
                icon: 'info',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = {
                account_id: parseInt(formData.account_id) // แปลง account_id เป็นตัวเลขก่อนส่ง
            };

            // เพิ่มเฉพาะข้อมูลที่เปลี่ยนแปลง
            if (formData.username !== originalData.username) {
                submitData.username = formData.username;
            }
            if (formData.email !== originalData.email) {
                submitData.email = formData.email;
            }
            if (formData.password.trim()) {
                submitData.password = formData.password;
            }

            const { data } = await axios.post(`${APT_ROOT}/api/admin/edit`, submitData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (data.message === "อัปเดตข้อมูลเรียบร้อยแล้ว") {
                Swal.fire({
                    title: 'Success!',
                    text: 'User information updated successfully',
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    // แก้ไขการ navigate โดยใช้ replace: true เพื่อป้องกันการกด back
                    navigate('/homepage', { 
                        replace: true,
                        state: { activeTab: 'users' } // ส่ง state เพื่อให้ไปที่แท็บ users
                    });
                });
            } else {
                setError(data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.response?.data?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // แก้ไข handleChange ให้ handle undefined
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || '' // ใส่ fallback เป็น string ว่าง
        }));
    };

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-[#F9FAFF] py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg border p-4">
                    <div className="mb-6">
                    {/* ส่วนหัวข้อ Edit User และ Changes detected */}
                    <div className="flex items-center justify-between w-full">
                        <h2 className="text-2xl font-bold text-gray-900 p-3">Edit User</h2>

                                {/* Changes detected */}
                                {checkDataChanged() && (
                                    <span className="text-green-600 text-sm flex items-center mr-3">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                        </svg>
                                        Changes detected
                                    </span>
                                )}
                            </div>

                            {/* คำอธิบายอยู่แยกบรรทัด */}
                            <p className="mt-3 text-sm text-gray-700 ml-2">
                                "Admins can easily edit user details such as email, password, or username. Please ensure the accuracy of the new information. Any changes to critical data will require confirmation."
                            </p>
                        </div>
                        
                        {error && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 p-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full mt-2 border rounded-[6px] p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    minLength={4}
                                    maxLength={20}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full mt-2 border rounded-[6px] p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password (Optional)
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full mt-2 border rounded-[6px] p-2 focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                                    minLength={6}
                                />
                                <p className="mt-2 text-sm text-gray-400">
                                    Leave blank to keep current password*
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/homepage/#users')}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !checkDataChanged()}
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                                        ${loading || !checkDataChanged() 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditUser;
