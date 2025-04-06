import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unknown = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="unknown-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h1>หน้าไม่พบ</h1>
      <p>ดูเหมือนว่าคุณจะเข้าถึงหน้าที่ไม่มีอยู่</p>
      <button 
        onClick={handleGoToLogin}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        ไปยังหน้าเข้าสู่ระบบ
      </button>
    </div>
  );
};

export default Unknown;
