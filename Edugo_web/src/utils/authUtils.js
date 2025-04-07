/**
 * Utility functions for authentication and token management
 */

/**
 * ตรวจสอบว่ามี token อยู่และยังไม่หมดอายุ
 * @returns {boolean} ผลการตรวจสอบ token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      console.log('Token expired');
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return false;
  }
};

/**
 * ดึงข้อมูลผู้ใช้งานจาก token
 * @returns {Object|null} ข้อมูลผู้ใช้หรือ null หากไม่มี token
 */
export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * ตรวจสอบว่าผู้ใช้มีบทบาทที่กำหนดหรือไม่
 * @param {string|string[]} roles บทบาทที่ต้องการตรวจสอบ
 * @returns {boolean} ผลการตรวจสอบบทบาท
 */
export const hasRole = (roles) => {
  const user = getUser();
  if (!user || !user.role) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

/**
 * ตรวจสอบสถานะของผู้ใช้
 * @returns {string|null} สถานะของผู้ใช้หรือ null หากไม่มีข้อมูล
 */
export const getUserStatus = () => {
  const user = getUser();
  return user ? user.status : null;
};

/**
 * ออกจากระบบและลบ token
 */
export const logout = () => {
  localStorage.removeItem('token');
  // อาจเพิ่มการเรียก API logout ได้ในอนาคต
};
