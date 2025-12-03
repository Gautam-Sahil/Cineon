import React from 'react'
import Adminimage from '../../assets/boy1.png'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, StarIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'



const AdminSidebar = () => {

    const user = {
        firtname: 'Admin',
        lastname: 'Gautam',
        imageUrl: Adminimage,
    }
   
     const adminNavLinks = [
        { name: 'Dashboards', path: '/admin', icon: LayoutDashboardIcon, current: true },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon, current: false },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon, current: false },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon,  },
      ]
  return (

    <div className=' h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/30 text-sm '>
     <img className='h-14 md:h-25 w-16 md:w-25 rounded-full mx-auto' src={user.imageUrl} alt={`${user.firtname} ${user.lastname}`} />
     <p className='mt-2 text-base max-md:hidden'>{user.firtname} {user.lastname}</p>
     <div className='w-full'>
        {adminNavLinks.map((link, index) =>(
            <NavLink key={index} to={link.path} end className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-slate-300 ${isActive && 'bg-primary/15 text-primary group'}`}>
              {({ isActive }) => (
                <>
                <link.icon className='w-5 h-5' />      
                <p className='max-md:hidden'>{link.name}</p>
                <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary'}`}></span>
                </>
                )}
            </NavLink>
        ))}

     </div>
    </div>
    
   
  )
}

export default AdminSidebar