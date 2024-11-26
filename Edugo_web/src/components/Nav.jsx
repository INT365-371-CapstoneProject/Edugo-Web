import React from 'react'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import img_edugo from '../assets/edugologo.svg'
import img_profile from '../assets/profiletest.jpeg'
import '../style/navstyle.css'; // Import CSS file

function Nav() {
  return (
    <div className="navbar-shadow">
      
       {/* โลโก้ด้านซ้าย */}
       <div className="flex items-center justify-start space-x-5">
            <Link to="/">
              <img src={img_edugo} alt="" style={{ height: "38px" }} />
            </Link>
        </div>

        {/* โปรไฟล์รูปกลมๆ ด้านขวา พร้อมชื่อ */}
        <div className="flex items-center justify-end space-x-5">
          <img src={img_profile} alt="" className="rounded-full w-9 h-10" />
          <div className="ml-2 text-center font-regular text-black">Provider Name</div> {/* เพิ่มชื่อด้านหลังรูปโปรไฟล์ */}
        </div>

        {/* <div className="w-2/3">
          <div className="form-control ml-10">
            <input type="text" placeholder="Scholarship Management" className="input input-bordered w-24 md:w-auto" />
          </div>
        </div> */}

        {/* <div className='w-1/3 flex flex-row'>
          <div className="dropdown dropdown-end ml-10">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
          <div className='font-bold ml-3 my-auto'>
            <h1 >Provider Name</h1>
          </div>
        </div> */}
      </div>
  )
}

export default Nav


