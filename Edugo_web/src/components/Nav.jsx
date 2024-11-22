import React from 'react'
import img_edugo from '../assets/edugo.jpg'
import { Link } from 'react-router-dom'
function Nav() {
  return (
    <div className="navbar shadow-lg">
      <div className=' m-auto divide-x flex-auto space-x-10'>
        <div className="w-1/3">
          <div className='justify-self-end py-1'>
            <Link to='/'>
              <img src={img_edugo} alt="" style={{ height: "50px" }} />
            </Link>
          </div>
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
    </div>
  )
}

export default Nav


