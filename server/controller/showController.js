import axios from "axios";
import Movie from "../model/Movie.js";
import Show from "../model/Show.js";

// ========== Helper: Get Movie Trailer Key from TMDB ==========
const getTrailerKey = async (tmdbId) => {
    try {
        if (!tmdbId) return null;

        const { data } = await axios.get(
            `https://api.themoviedb.org/3/movie/${tmdbId}/videos`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                },
            }
        );

        // Find the official, main trailer from the results
        const trailer = data.results.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        return trailer ? trailer.key : null;
    } catch (err) {
        console.error(`Trailer fetch failed for TMDB ID ${tmdbId}:`, err.message);
        return null;
    }
};

// --- Trakt Cast Helper (Fallback and utility) ---
const getTraktCastNames = async (slug, limit = 10) => {
    try {
        const { data } = await axios.get(
            `https://api.trakt.tv/movies/${slug}/people`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": process.env.TRAKT_API_KEY,
                },
            }
        );
        // Return an array of objects for consistent structure
        return data.cast?.slice(0, limit).map((c) => ({
            name: String(c.person.name),
            character: c.character,
            image: null // No image from Trakt
        })) || [];
    } catch (err) {
        console.error(`Trakt fallback cast fetch failed for ${slug}:`, err.message);
        return [];
    }
};

// --- Helper: Fetch Cast from TMDB ---
const fetchCastFromTmdb = async (tmdbId, traktSlug) => {
    try {
        const { data: tmdbCastData } = await axios.get(
            `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
            { 
                params: { 
                    api_key: process.env.TMDB_API_KEY 
                } 
            }
        );

        const cast = tmdbCastData.cast || [];
        const baseImageUrl = "https://image.tmdb.org/t/p/w185";

        return cast.slice(0, 10).map((c) => ({
            name: String(c.name),
            character: c.character,
            image: c.profile_path ? `${baseImageUrl}${c.profile_path}` : null,
        }));
    } catch (error) {
        console.error(`TMDB Cast fetch failed for ${traktSlug}:`, error.message);
        return getTraktCastNames(traktSlug, 10); // Fallback to Trakt names
    }
}

// --- Combined Helper: Get Movie Details (Cast, Trailer) ---
const getMovieDetails = async (traktSlug) => {
    try {
        // 1. Get detailed movie data from Trakt to find external IDs (TMDB ID)
        const { data: traktData } = await axios.get(
            `https://api.trakt.tv/movies/${traktSlug}?extended=full,images`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": process.env.TRAKT_API_KEY,
                },
            }
        );

        const tmdbId = traktData.ids.tmdb;
        
        // 2. Fetch cast and trailer concurrently
        const [cast, trailerKey] = await Promise.all([
            tmdbId ? fetchCastFromTmdb(tmdbId, traktSlug) : getTraktCastNames(traktSlug, 10),
            getTrailerKey(tmdbId),
        ]);

        return { 
            cast, 
            trailerKey,
            traktData, // Pass the Trakt data back for easy access to images/metadata
        }; 

    } catch (err) {
        console.error(`Movie details fetch failed for ${traktSlug}:`, err.message);
        return { 
            cast: await getTraktCastNames(traktSlug, 10), 
            trailerKey: null,
            traktData: null,
        };
    }
};


// ========== Helper: Extract Trakt images safely ==========
const getTraktImageUrls = (images = {}) => {
    const poster =
        images.poster?.[0] || images.poster?.full || images.poster?.medium || "";
    const fanart =
        images.fanart?.[0] || images.fanart?.full || images.fanart?.medium || "";

    // Prepend protocol if missing (Trakt returns URLs without https://)
    const normalize = (url) =>
        url
            ? url.startsWith("http")
                ? url
                : `https://${url}`
            : "https://via.placeholder.com/500x750?text=No+Image";

    return {
        poster_path: normalize(poster),
        backdrop: normalize(fanart),
    };
};

// ========== GET Trending (Now Playing) Movies ==========
export const getNowPlayingMovies = async (req, res) => {
    try {
        const traktUrl =
            "https://api.trakt.tv/movies/trending?extended=full,images";
        const { data } = await axios.get(traktUrl, {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": process.env.TRAKT_API_KEY,
            },
        });

        const movies = await Promise.all(
            data.map(async (item) => {
                const movie = item.movie;
                
                // Use the combined helper
                const { cast, trailerKey } = await getMovieDetails(movie.ids.slug); 

                const { poster_path, backdrop } = getTraktImageUrls(movie.images);

                return {
                    trakt_id: movie.ids.trakt,
                    slug: movie.ids.slug,
                    title: movie.title,
                    year: movie.year,
                    overview: movie.overview || "",
                    genres: movie.genres || [],
                    runtime: movie.runtime || 0,
                    rating: movie.rating || 0,
                    votes: movie.votes || 0,
                    released: movie.released || "",
                    poster_path,
                    backdrop,
                    cast,
                    trailer_key: trailerKey, // <--- Add the trailer key
                };
            })
        );

        // Store or update in DB
        await Movie.insertMany(movies, { ordered: false }).catch(() => {});

        res.json({ success: true, movies });
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== POST Add Show ==========
export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findOne({ trakt_id: movieId });

        if (!movie) {
            // Fetch metadata, cast, and trailer using the combined helper
            const { cast, trailerKey, traktData } = await getMovieDetails(movieId); 
            
            // If Trakt data couldn't be fetched (traktData is null/undefined), handle it gracefully
            if (!traktData) {
                 return res.status(404).json({ success: false, message: "Movie not found or failed to fetch details from Trakt." });
            }

            const { poster_path, backdrop } = getTraktImageUrls(traktData.images);

            const movieDetails = {
                trakt_id: traktData.ids.trakt,
                slug: traktData.ids.slug,
                title: traktData.title,
                overview: traktData.overview || "",
                genres: traktData.genres || [],
                cast,
                released: traktData.released || "",
                languages: traktData.languages || [],
                year: traktData.year,
                runtime: traktData.runtime || 0,
                votes: traktData.votes || 0,
                rating: traktData.rating || 0,
                poster_path,
                backdrop,
                trailer_key: trailerKey, // <--- Add the trailer key
            };

            movie = await Movie.create(movieDetails);
        }

        // Create show documents
        const showsToCreate = [];
        showsInput.forEach((show) => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movie._id,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {},
                });
            });
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        res.json({ success: true, message: "Show(s) added successfully" });
    } catch (error) {
        console.error("Add show error:", error.message);
        res
            .status(500)
            .json({ success: false, message: "Failed to add show", error: error.message });
    }
};

// ========== GET All Upcoming Shows (CRASH FIX IMPLEMENTED) ==========
export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate("movie")
            .sort({ showDateTime: 1 });

        const uniqueMovies = new Map();
        shows.forEach((show) => {
            // 🛑 FIX: Ensure show.movie is NOT null before accessing properties
            if (show.movie) { 
                const movieId = show.movie._id.toString();
                if (!uniqueMovies.has(movieId)) {
                    uniqueMovies.set(movieId, show.movie);
                }
            } else {
                // Log orphaned data for database cleanup
                console.warn(`Orphaned Show found, ID: ${show._id}. Skipping.`);
            }
        });

        res.json({ success: true, shows: Array.from(uniqueMovies.values()) });
    } catch (error) {
        console.error("Get shows error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ========== GET Single Movie's Shows ==========
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;

        const shows = await Show.find({
            movie: movieId,
            showDateTime: { $gte: new Date() },
        });
        const movie = await Movie.findById(movieId);

        const dateTime = {};
        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) dateTime[date] = [];
            dateTime[date].push({ time: show.showDateTime, showId: show._id });
        });

        res.json({ success: true, movie, dateTime });
    } catch (error) {
        console.error("Get show error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// showController.js
export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ released: -1 });
        res.json({ success: true, movies });
    } catch (error) {
        console.error("Error fetching all movies:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};