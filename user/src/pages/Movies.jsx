import React from 'react'

import MovieCard from '../components/MovieCard'
import BlueCircle from './../components/BlueCircle';
import { useAppContext } from '../context/AppContext'
const Movies = () => {


  const { shows } = useAppContext()
  return shows.length > 0 ?  (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlueCircle top='150px' left='0px'/>
        <BlueCircle bottom='150px' right='0px'/>
      <h1 className=' text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap gap-8 mzx-sm:justify-center'>
        {shows.map((movie) => (
        <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) :(
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className=' text-lg font-bold my-4 text-center'>No Movies Available</h1>
    
    </div>
  )
}

export default Movies
