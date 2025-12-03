import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, ALargeSmall, Languages, CalendarDays } from "lucide-react";
import Loading from "../components/Loading";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// --- 1. The Media Card (Updated Design) ---
const MediaCard = ({ item, type }) => {
  const navigate = useNavigate();
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const lang = item.original_language?.toUpperCase();

  return (
    <div className="relative min-w-[200px] w-[200px] md:min-w-[240px] md:w-[240px] bg-teal-950 rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-blue-500/20">
      
      {/* Poster Image */}
<div className="relative aspect-[2/3] w-full overflow-hidden">
  <img
    src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
    alt={title}
    className="w-full h-full object-cover"
  />
</div>


      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-white text-lg truncate" title={title}>
          {title}
        </h3>

        {/* Labels / Tags Section */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-300">
          <div className="flex items-center gap-1 bg-emerald-800 px-2 py-1 rounded">
            <Languages className="w-3 h-3 text-blue-400" />
            <span>{lang}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-800 px-2 py-1 rounded">
             <CalendarDays className="w-3 h-3 text-red-400" />
             <span>{date?.split("-")[0] || 'N/A'}</span>
          </div>
        </div>

        {/* More Info Button (Appears on Hover/Focus or Static) */}
        <button
          onClick={() => navigate(`/moreinfo/${type}/${item.id}`)}
          className="mt-3 w-full py-2 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-2xl transition-colors"
        >
          More Info
        </button>
      </div>
    </div>
  );
};

// --- 2. Reusable Scrollable Row Component ---
const MediaRow = ({ title, data, type }) => {
  const rowRef = useRef(null);

  const scroll = (offset) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-12 mt-18 relative group/row">
      <h2 className="text-xl font-bold mb-8 pl-4 border-l-4 border-primary ml-4 md:ml-0">
        {title}
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-500)}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Scrollable Container (Scrollbar hidden via CSS) */}
        <div
          ref={rowRef}
          className="flex gap-6 overflow-x-auto overflow-y-visible px-4 md:px-0 scrollbar-hide scroll-smooth py-4"
        >
          {data.map((item) => (
            <MediaCard key={item.id} item={item} type={type} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(500)}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

// --- 3. Main Page Component ---
const Theatre = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
          axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
        ]);

        setUpcoming(movieRes.data.results);
        setPopularTV(tvRes.data.results);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loading/></div>;

  return (
    <div className="min-h-screen bg-black pt-25 pb-10 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden">
      <MediaRow title="Upcoming Movies" data={upcoming} type="movie" />
      <MediaRow title="Popular TV Shows" data={popularTV} type="tv" />
    </div>
  );
};

export default Theatre;