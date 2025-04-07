import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../style/style.css';
import xicon from '../assets/xicon.svg';
import vicon from '../assets/vicon.svg';

const APT_ROOT = import.meta.env.VITE_API_ROOT;

const getConfigWithToken = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

function ProviderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState(false);

  // สถานะแสดงผลตามค่า verify
  const statusColors = {
    Yes: "bg-green-100 text-green-800",
    No: "bg-red-100 text-red-800",
    Waiting: "bg-yellow-100 text-yellow-800"
  };

  const statusLabels = {
    Yes: "Approved",
    No: "Rejected",
    Waiting: "Pending"
  };

  useEffect(() => {
    const fetchProviderDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${APT_ROOT}/api/admin/provider/${id}`, getConfigWithToken());
        setProvider(response.data);
      } catch (err) {
        console.error('Error fetching provider details:', err);
        setError('Failed to load provider details');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetail();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    // ตรวจสอบว่าวันที่ถูกต้องหรือไม่
    if (isNaN(date.getTime())) return "Invalid date";
    
    // สร้างรูปแบบวันที่เป็น "24 Jan 2025"
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // ฟังก์ชันสำหรับอัปเดตสถานะ provider
  const updateProviderStatus = async (newStatus) => {
    if (updateInProgress) return; // ป้องกันการกดปุ่มซ้ำ
    
    try {
      setUpdateInProgress(true);
      
      const result = await Swal.fire({
        title: 'Confirm Action',
        html: `<p class="text-gray-700 text-lg pb-4">
        Are you sure you want to 
        <strong class="${newStatus === 'Yes' ? 'text-green-600' : 'text-red-600'} text-xl">
          ${newStatus === 'Yes' ? 'approve' : 'reject'}
        </strong> this provider?
      </p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `<span class=" px-10 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 mr-10">Confirm</span>`,
        cancelButtonText: `<span class=" px-10 py-2 bg-[#94A2B8] text-white rounded-lg shadow-md hover:bg-[#64738B]">Cancel</span>`,
        customClass: {
          confirmButton: 'swal2-confirm',
          cancelButton: 'swal2-cancel',
          popup: 'rounded-xl pb-10'
        },
        buttonsStyling: false
      });
      
      if (result.isConfirmed) {
        // แก้ไข endpoint และรูปแบบข้อมูลที่ส่งไป
        const response = await axios.put(
          `${APT_ROOT}/api/admin/verify/${id}`, 
          { status: newStatus }, 
          getConfigWithToken()
        );
        
        if (response.status === 200) {
          await Swal.fire({
            title: 'Success!',
            text: `Provider has been ${newStatus === 'Yes' ? 'approved' : 'rejected'}.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          
          // อัปเดต state เพื่อแสดงผลข้อมูลล่าสุด
          setProvider(prev => ({
            ...prev,
            verify: newStatus
          }));
        }
      }
    } catch (err) {
      console.error('Error updating provider status:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update provider status',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setUpdateInProgress(false);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading provider details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !provider) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error || "Provider not found"}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#F9FAFF] mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 w-full">
            {/* Header */}
            <div className="px-8 py-4 flex justify-between items-center mt-4 w-full">
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Approval #{provider.id.toString().padStart(4, '0')}</h1>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-800 mr-2"
              >
                Back
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8 -mt-3">

              {/* Provider Status */}
              <div className="border rounded-lg mx-auto p-4 border-gray-200 w-full ">

              <div className="mb-2 flex items-center justify-between ">
                <h2 className="text-lg font-semibold text-gray-400">Provider Name</h2>

                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[provider.verify] || "bg-gray-100 text-gray-800"}`}>
                  {statusLabels[provider.verify] || "Unknown"}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-6">{provider.name || provider.company_name || "Not specified"}</p>
              
              {/* Add a horizontal line under Provider Name */}
              <div className="border-b border-gray-300 mb-6"></div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Website (URL)</p>
                  <p className="mt-1 break-words">
                    {provider.url ? (
                      <a href={provider.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {provider.url}
                      </a>
                    ) : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 break-words text-gray-700">{provider.address || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mt-4">Phone</p>
                  <p className="mt-1 break-words text-gray-700">{provider.phone || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mt-4">Email</p>
                  <p className="mt-1 break-words text-gray-700">{provider.email || "Not specified"}</p>
                </div>
              </div>

              </div>
              
              {/* Buttons */}
              <div className="flex justify-between space-x-2 mt-6">
                <button 
                  onClick={() => updateProviderStatus('No')} 
                  className="text-white px-4 py-2 bg-[#94A2B8] text-gray-700 rounded-md hover:bg-[#64738B] w-full"
                >
                  Decline
                   <span className="ml-2">
                   <img src={xicon} alt="Add Admin Icon" className="w-5 h-5 inline" />
                   </span>
                </button>

                <button 
                  onClick={() => updateProviderStatus('Yes')} 
                  className="text-white px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
                >
                  Approve
                  <span className="ml-2">
                   <img src={vicon} alt="Add Admin Icon" className="w-5 h-5 inline" />
                   </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderDetail;
