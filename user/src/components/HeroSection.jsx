import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import backgroundImage from '../assets/backgroundImage.png'
import React from 'react'
import { assets } from '../assets/assets'
// import assets from '../assets/assets.js'
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  return (
    <>
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-screen bg-cover bg-center ' style={{backgroundImage: `url(${backgroundImage})`}}>
      
        <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20'/>
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'> Gaurdians <br />of the Galaxy</h1>
      
      <div className='flex items-center gap-4 text-gray-300'>
        <span>Action  |  Adventure  | Sci-Fi</span>
                                                   </div>  
       <div className='flex items-center gap-1'>
      <CalendarIcon className='w-4.5 h-4.5 text-gray-300'/>
      <span className='text-gray-300'>Releases on July 21, 2024</span>
     </div>

     <div className='flex items-center gap-1'>
      <ClockIcon className='w-4.5 h-4.5 text-gray-300'/>
      <span className='text-gray-300'>2h 8m</span>
     </div>
     <p className='max-w-md text-gray-300'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, pariatur? Non, consequuntur. Alias facere repellat deserunt dolor quos ?</p>

      <div className="relative inline-block p-0.5 rounded-full overflow-hidden  transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[repeating-conic-gradient(from_0deg,#A100FFFF,#119CFDFF,#00F9FF)] button-wrapper">
                <button onClick={() => navigate('/movies')} className="relative z-10 bg-gray-800 flex items-centre gap-1  hover:bg-primary-dull rounded-full px-6 py-3 font-medium text-sm cursor-pointer">  Explore Movies

                  <ArrowRight className='w-5 h-5'/>
                </button>
            </div>

    </div>
  </>
  )
}

export default HeroSection
