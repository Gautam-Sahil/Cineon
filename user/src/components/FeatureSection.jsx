import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import BlueCircle from './BlueCircle';
import { dummyShowsData } from '../assets/assets';
import MovieCard from './MovieCard';

const FeatureSection = () => {
    const navigate = useNavigate();
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44'>
      
         <div className='relative flex items-center justify-between pt-20 pb-10'>
            <BlueCircle top='0' right='-80px'/>
            <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
            <button onClick={() => navigate('/movies')} className='gorup flex items-center gap-2 text-sm text-grey-300 cursor-pointer'>view All <ArrowRight className='group-hover:tracking-x-0.5 transition w-4.5 h-4.5'/></button>
             </div>
          
          <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>{dummyShowsData.slice(0, 4).map((show) =>(
            <MovieCard key={show._id} movie={show}/>
          ) )}</div>

               
         <div className='flex justify-center mt-20'> <div className="button-bg1 rounded-md p-0.5 hover:scale-105 transition duration-300 active:scale-100">
    <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className="px-10 text-sm py-3 text-white rounded-md font-medium bg-gray-800 hover:bg-primary-dull transition cursor-pointer">
        Show More
    </button>
</div>
     </div>
    
         

    </div>
    
  )
}

export default FeatureSection