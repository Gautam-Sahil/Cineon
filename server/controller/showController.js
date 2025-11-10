import axios from "axios";
import Movie from "../model/Movie.js";
import Show from "../model/Show.js";

// ========== Helper: Get movie cast ==========
const getMovieCast = async (slug) => {
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
    return data.cast?.slice(0, 5).map((c) => c.person.name) || [];
  } catch (err) {
    console.error(`Cast fetch failed for ${slug}:`, err.message);
    return [];
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
        const cast = await getMovieCast(movie.ids.slug);
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
      const { data: traktMovieData } = await axios.get(
        `https://api.trakt.tv/movies/${movieId}?extended=full,images`,
        {
          headers: {
            "Content-Type": "application/json",
            "trakt-api-version": "2",
            "trakt-api-key": process.env.TRAKT_API_KEY,
          },
        }
      );

      const cast = await getMovieCast(traktMovieData.ids.slug);
      const { poster_path, backdrop } = getTraktImageUrls(
        traktMovieData.images
      );

      const movieDetails = {
        trakt_id: traktMovieData.ids.trakt,
        slug: traktMovieData.ids.slug,
        title: traktMovieData.title,
        overview: traktMovieData.overview || "",
        genres: traktMovieData.genres || [],
        cast,
        released: traktMovieData.released || "",
        languages: traktMovieData.languages || [],
        year: traktMovieData.year,
        runtime: traktMovieData.runtime || 0,
        votes: traktMovieData.votes || 0,
        rating: traktMovieData.rating || 0,
        poster_path,
        backdrop,
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

// ========== GET All Upcoming Shows ==========
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const uniqueMovies = new Map();
    shows.forEach((show) => {
      if (!uniqueMovies.has(show.movie._id.toString())) {
        uniqueMovies.set(show.movie._id.toString(), show.movie);
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
