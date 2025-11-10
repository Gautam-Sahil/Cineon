import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import {  MenuIcon, Search, TicketPlus, XIcon, } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import Favorite from './../pages/Favorite';
import { useAppContext } from '../context/Appcontext'


const Navbar = () => {

 const [isopen, setIsOpen] = React.useState(false);

 const {user} = useUser()
 const {openSignIn} = useClerk()

 const navigate = useNavigate();

 const { favoriteMovies } = useAppContext()

  return (
    <div className='fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 lg:px-36 py-5   '>
    <Link to='/' className='mx-md:flex-1'>
    <img src={assets.logo} alt="Cinión°" className='w-36 h-auto' />
    </Link>
     



<div id='button1'
  className={`rainbow relative max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg py-0.5 px-0.5 z-50 flex flex-col md:flex-row max-md:justify-center gap-8 max-md:h-screen md:rounded-full sm:rounded-none backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 transition-[width] duration-300 ${
    isopen ? 'max-md:w-full p-4' : 'max-md:w-0'
  } overflow-hidden justify-center`}
>
  <button id='button1' className="px-8 text-sm py-3.5 md:rounded-full sm:rounded-none font-medium bg-gray-800 text-white flex flex-col md:flex-row items-center gap-8 relative">
    <XIcon
      className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
      onClick={() => setIsOpen(!isopen)}
    />

    <Link onClick={() => {scrollTo(0, 0); setIsOpen(false)}} to="/">Home</Link>
    <Link onClick={() => {scrollTo(0, 0); setIsOpen(false)}} to="/movies">Movies</Link>
    <Link onClick={() => {scrollTo(0, 0); setIsOpen(false)}} to="/">Theatre</Link>
    <Link onClick={() => {scrollTo(0, 0); setIsOpen(false)}} to="/">Releases</Link>
 { favoriteMovies.length > 0 &&  <Link onClick={() => {scrollTo(0, 0); setIsOpen(false)}} to="/favorite">Favorite</Link>}
  </button>
</div>
       
 
  <div className="flex items-center gap-8 relative z-60">
  <Search className="max-md:hidden w-6 h-6 cursor-pointer" />
  {!user ? (
   <div className="button-bg rounded-full p-[2.8px] hover:scale-105 transition duration-300 active:scale-100">
                <button onClick={openSignIn} className="px-7 text-md py-2.5 rounded-full font-medium bg-gray-800 hover:bg-primary-dull cursor-pointer">
                   Login
                </button>
            </div>
  ) : (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Bookings"
          labelIcon={<TicketPlus width={15} />}
          onClick={() => navigate("/my-bookings")}
        />
      </UserButton.MenuItems>
    </UserButton>
  )}
  {/* ✅ Keep MenuIcon inside same container, but higher z-index */}
  <MenuIcon
    className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer z-70 relative"
    onClick={() => setIsOpen(!isopen)}
  />
</div>
    </div>
  )
}

export default Navbar
