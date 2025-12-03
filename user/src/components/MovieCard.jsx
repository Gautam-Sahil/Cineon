import { StarIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../library/timeFormat';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Safe extraction of Trakt images
  const title = movie?.title || 'Untitled';
  const releaseYear = movie?.released ? new Date(movie.released).getFullYear() : 'N/A';
  const voteAverage = movie?.rating ? movie.rating.toFixed(1) : 'N/A';

  return (
    <div className='flex flex-col justify-between p-3 bg-teal-950 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>
      <img
        onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }}
        src={movie.backdrop}
        alt={title}
        className='rounded-lg h-52 w-full object-cover object-bottom-right cursor-pointer'
      />

      <p className='font-semibold mt-2 truncate'>{title}</p>
      <p className='text-sm text-gray-400 mt-2'>
        {releaseYear} • {/* genres might not be available from Trakt */} • {movie.runtime ? timeFormat(movie.runtime) : 'N/A'}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }}
          className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
        >
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className='w-4 h-4 text-amber-500 fill-amber-600' /> {voteAverage}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
