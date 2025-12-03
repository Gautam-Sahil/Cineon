import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    PlayCircleIcon, StarIcon, Clock, Calendar, Info, Globe, Users
} from 'lucide-react';
import { toast } from 'sonner';
import Loading from '../components/Loading';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const MoreInfo = () => {
    const { type, id } = useParams();
    const [details, setDetails] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const formatRuntime = (mins) => {
        if (!mins) return 'N/A';
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,similar`;
                const { data } = await axios.get(url);
                setDetails(data);

                const trailerVideo = data.videos?.results?.find(
                    (v) => v.type === "Trailer" && v.site === "YouTube"
                );
                setTrailerKey(trailerVideo ? trailerVideo.key : null);
            } catch (err) {
                console.error("Error fetching details:", err);
                toast.error("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, type]);

    if (loading) return <Loading />;
    if (!details) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;

    const title = details.title || details.name;
    const releaseDate = details.release_date || details.first_air_date;
    const runtime = type === 'movie'
        ? formatRuntime(details.runtime)
        : `${details.episode_run_time?.[0] || '?'}m / ep`;
    const backdropPath = details.backdrop_path
        ? `${BACKDROP_BASE_URL}${details.backdrop_path}`
        : null;

    return (
        <div className="min-h-screen bg-black text-white relative font-sans">

            {/* Backdrop */}
            <div className="relative h-[80vh] w-full">
                {backdropPath && (
                    <div
                        className="absolute inset-0 bg-cover bg-top"
                        style={{ backgroundImage: `url(${backdropPath})` }}
                    ></div>
                )}
            </div>

            {/* Main Content */}
            <div className="relative z-10 -mt-40 lg:-mt-60 w-full max-w-6xl mx-auto px-4 md:px-6 pb-20">

                <div className="flex flex-col md:flex-row gap-10">

                    {/* Poster */}
                    <img
                        src={
                            details.poster_path
                                ? `${IMAGE_BASE_URL}${details.poster_path}`
                                : "https://via.placeholder.com/300x450"
                        }
                        alt={title}
                        className="w-72 md:w-80 max-h-[450px] rounded-xl shadow-xl border border-gray-800 object-cover"
                    />

                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold">{title}</h1>
                            <p className="text-xl text-slate-300 italic">{details.tagline}</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                           <div className="button-bg   rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100">
    <button
        onClick={() =>
            trailerKey ? setIsTrailerOpen(true) : toast.error("No Trailer Available")
        }
        className="flex items-center gap-2 px-8 py-2.5 text-sm border-2 bg-sky-700 text-white 
                   rounded-full font-medium"
    >
        <PlayCircleIcon className="w-5 h-5" />
        {trailerKey ? "Watch Trailer" : "No Trailer"}
    </button>
</div>


                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 rounded-full border">
                                <StarIcon className="w-5 h-5 text-yellow-500" />
                                <span className="font-bold text-lg">{details.vote_average?.toFixed(1)}</span>
                                <span className="text-xs text-lime-300">/ 10</span>
                            </div>
                        </div>

                          {/* QUICK STATS (Horizontal, Small, No Overflow) */}
                        <div className="flex flex-wrap gap-8 p-4 bg-gray-900/80 rounded-xl border border-gray-700 w-auto max-w-max">
                            <div>
                                <p className="text-lime-200 text-xs uppercase flex items-center gap-1">
                                    <Info className="w-3 h-3" /> Status
                                </p>
                                <p className="font-semibold">{details.status}</p>
                            </div>

                            <div>
                                <p className="text-lime-200 text-xs uppercase flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Release
                                </p>
                                <p className="font-semibold">{releaseDate}</p>
                            </div>

                            <div>
                                <p className="text-lime-200 text-xs uppercase flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Runtime
                                </p>
                                <p className="font-semibold">{runtime}</p>
                            </div>

                            <div>
                                <p className="text-lime-200 text-xs uppercase flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Language
                                </p>
                                <p className="font-semibold">
                                    {details.original_language?.toUpperCase()}
                                </p>
                            </div>
                        </div>


                        {/* Genres */}
                        <div className="flex flex-wrap gap-2">
                            {details.genres?.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-2 py-1 bg-gray-800 text-lime-300 text-sm rounded-md border"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <div>
                            <h3 className="text-xl font-bold mb-2 border-l-4 border-primary pl-3">Overview</h3>
                            <p className="text-gray-300 leading-relaxed text-md break-words whitespace-pre-wrap">
                                {details.overview || "No overview available."}
                            </p>
                        </div>

                        {/* Cast */}
                        {details.credits?.cast?.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3 flex items-center gap-2">
                                    <Users className="w-5 h-5" /> Top Cast
                                </h3>

                                <div className="flex flex-wrap gap-4">
                                    {details.credits.cast.slice(0, 15).map((actor) => (
                                        <div key={actor.id} className="w-[90px] flex flex-col items-center text-center">
                                            <img
                                                src={
                                                    actor.profile_path
                                                        ? `${IMAGE_BASE_URL}${actor.profile_path}`
                                                        : `https://ui-avatars.com/api/?name=${actor.name}`
                                                }
                                                className="w-20 h-20 rounded-full object-cover border"
                                            />
                                            <p className="text-[14px] font-bold mt-1">{actor.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {isTrailerOpen && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
                    onClick={() => setIsTrailerOpen(false)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-red-500"
                            onClick={() => setIsTrailerOpen(false)}
                        >
                            ✕
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoreInfo;
