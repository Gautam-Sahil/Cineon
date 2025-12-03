import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { CheckIcon, StarIcon, CalendarDays } from 'lucide-react';
import { kConverter } from '../../library/kConverter';
import DateTimeSelector from './DateTimeSelector';
import ShowPriceInput from './ShowPriceInput';
import { useAppContext } from '../../context/AppContext'


const AddShow = () => {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  console.log(nowPlayingMovies)
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState('');
    const [addingShow, setaddingShow] = useState(false);


  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) setNowPlayingMovies(data.movies);
    } catch (error) {
      console.error('Error fetching movies', error);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split('T');
    if (!date || !time) return;

    setDateTimeSelection(prev => {
      const times = prev[date] || [];
      if (!times.includes(time)) return { ...prev, [date]: [...times, time] };
      return prev;
    });
    setDateTimeInput('');
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection(prev => {
      const filteredTimes = prev[date].filter(t => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

const handleAddShow = async () => {
  // --- validation before setting loading ---
  if (!selectedMovie) {
    toast.error('Please select a movie!');
    return;
  }

  if (!showPrice) {
    toast.error('Please set show price!');
    return;
  }

  if (Object.keys(dateTimeSelection).length === 0) {
    toast.error('Please add at least one date/time!');
    return;
  }

  try {
    setaddingShow(true);

    // prepare payload
    const showsInput = Object.entries(dateTimeSelection).map(([date, time]) => ({
      date,
      time,
    }));

    const payload = {
      movieId: selectedMovie,
      showsInput,
      showPrice: Number(showPrice),
    };

    const { data } = await axios.post('/api/show/add', payload, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (data.success) {
      toast.success(data.message || 'Show added successfully!');
      setSelectedMovie(null);
      setDateTimeSelection({});
      setShowPrice('');
    } else {
      toast.error(data.message || 'Something went wrong!');
    }
  } catch (error) {
    console.error('submission error', error);
    toast.error('An error occurred. Try again!');
  } finally {
    setaddingShow(false);
  }
};


  useEffect(() => { if (user) fetchNowPlayingMovies(); }, [user]);

  if (nowPlayingMovies.length === 0) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-6 mt-6 ml-2 w-max">
          {nowPlayingMovies.map(movie => (
            <div
              key={movie.slug}
              onClick={() => setSelectedMovie(movie.trakt_id)}
              className={`relative max-w-[180px] rounded-lg cursor-pointer transition duration-300 
                ${selectedMovie === movie.trakt_id ? 'border-2 border-teal-400 shadow-md scale-[1.02]' : 'border hover:border-primary/40'}`}
            >
              <div className="relative w-full overflow-hidden rounded-md bg-gray-100">
                <img
                  src={ movie.poster_path}
                  alt={movie.title}
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105 brightness-90"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 flex items-center justify-between text-xs text-gray-300">
                  <p className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-fuchsia-500 fill-fuchsia-400" />
                    {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                  </p>
                  <p>{movie.votes ? kConverter(movie.votes) : 0} votes</p>
                </div>
                {selectedMovie === movie.trakt_id && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded-full shadow-md">
                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              <div className="mt-2 space-y-0.5  px-1">
                <p className="font-medium truncate text-gray-200">{movie.title}</p>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-rose-400" />
                  {movie.released}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShowPriceInput currency={currency} showPrice={showPrice} setShowPrice={setShowPrice} />
      <DateTimeSelector
        dateTimeInput={dateTimeInput}
        setDateTimeInput={setDateTimeInput}
        handleDateTimeAdd={handleDateTimeAdd}
        dateTimeSelection={dateTimeSelection}
        handleRemoveTime={handleRemoveTime}
      />

      <div className="mt-10">
        <button onClick={handleAddShow} disabled={addingShow} className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/80 transition">
          Add Show
        </button>
      </div>
    </>
  );
};

export default AddShow;
