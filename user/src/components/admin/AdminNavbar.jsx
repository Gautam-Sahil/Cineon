import React from 'react'
import { Link } from 'react-router-dom'


const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
       <Link to="/">
     <h3 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-lime-200 to-emerald-400'>
    Cinion
  </h3>
       </Link>
      
    </div>
  )
}

export default AdminNavbar