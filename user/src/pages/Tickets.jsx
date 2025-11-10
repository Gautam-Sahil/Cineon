import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlueCircle from './../components/BlueCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../library/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/Appcontext';
import { toast } from 'sonner';

const Tickets = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies } =
    useAppContext();

  // Fetch single movie + shows
  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) setShow(data);
    } catch (error) {
      console.error('Error fetching show:', error.message);
    }
  };

  // Handle favorite toggle
  const handleFavorite = async () => {
    if (!user) return toast.error('Please login to proceed');

    // Optimistic UI toggle
    setIsFavorite(!isFavorite);

    try {
      const { data } = await axios.post(
        '/api/user/update-favorite',
        { movieId: id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      } else {
        toast.error('Could not update favorites');
        setIsFavorite(!isFavorite); // revert UI
      }
    } catch (error) {
      console.error('Favorite error:', error.message);
      toast.error('Failed to update favorite');
      setIsFavorite(!isFavorite); // revert UI
    }
  };

  // Fetch show on mount or when ID changes
  useEffect(() => {
    if (id) getShow();
  }, [id]);

  // Update favorite state when favoriteMovies changes
  useEffect(() => {
    setIsFavorite(favoriteMovies.some((m) => m._id === id));
  }, [favoriteMovies, id]);

  // Loading state
  if (!show) return <Loading />;

  const movie = show.movie || {};
  const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
  const releaseYear = movie.released
    ? new Date(movie.released).getFullYear()
    : 'N/A';
  const runtime = movie.runtime ? timeFormat(movie.runtime) : 'N/A';
  const genres = movie.genres?.length ? movie.genres.join(', ') : 'N/A';

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={movie.poster_path}
          alt={movie.title || 'Movie Poster'}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />
        <div className="relative flex flex-col gap-3">
          <BlueCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {movie.title || 'Untitled'}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {rating} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {movie.overview || 'No description available.'}
          </p>
          <p>
            {runtime} • {genres} • {releaseYear}
          </p>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" /> Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-primary text-primary' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

     {/* Cast Section */}
<p className="text-lg font-medium mt-20">Your Favorite Cast</p>
<div className="overflow-x-auto no-scrollbar mt-8 pb-4">
  <div className="flex items-center gap-4 w-max px-4">
    {movie.cast && movie.cast.length > 0 ? (
      movie.cast.slice(0, 12).map((castMember, index) => {
        // Handle both string and object formats
        const name = typeof castMember === 'string' ? castMember : castMember.name;
        const image =
          castMember?.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;

        return (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="md:h-20 h-20 w-20 overflow-hidden rounded-full">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs font-medium mt-3 text-center">{name}</p>
          </div>
        );
      })
    ) : (
      <p className="text-gray-400 text-sm">No cast information available.</p>
    )}
  </div>
</div>


      {/* Showtime selection */}
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* Suggested movies */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default Tickets;
