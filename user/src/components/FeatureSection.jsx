import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import BlueCircle from './BlueCircle';
import MovieCard from './MovieCard';
import { useAppContext } from './context/AppContext'

const FeatureSection = () => {
  const { shows } = useAppContext();
  const navigate = useNavigate();

  // Ensure shows is always an array
  const safeShows = Array.isArray(shows) ? shows : [];

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44'>
      
      <div className='relative flex items-center justify-between pt-20 pb-10'>
        <BlueCircle top='0' right='-80px'/>
        <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
        <button 
          onClick={() => navigate('/movies')} 
          className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'
        >
          View All 
          <ArrowRight className='group-hover:tracking-x-0.5 transition w-4.5 h-4.5'/>
        </button>
      </div>
      
      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
        {safeShows.slice(0, 4).map((show) => (
          <MovieCard 
            key={show._id || show.id} 
            movie={show || {}} // fallback to empty object
          />
        ))}
        {safeShows.length === 0 && (
          <p className="text-gray-500 mt-4">No movies available.</p>
        )}
      </div>

      <div className='flex justify-center mt-20'>
        <div className="button-bg1 rounded-md p-0.5 hover:scale-105 transition duration-300 active:scale-100">
          <button 
            onClick={() => {navigate('/movies'); scrollTo(0,0)}} 
            className="px-10 text-sm py-3 text-white rounded-md font-medium bg-green-950 hover:bg-primary-dull transition cursor-pointer"
          >
            Show More
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection;
