import React, { useEffect, useRef, useState } from "react";
import "./HeroSlider.css";
import timeFormat from "../library/timeFormat";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const POPULAR_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`;

const HeroSection = () => {
  const [movies, setMovies] = useState([]);

  const sliderRef = useRef(null);
  const listRef = useRef(null);
  const thumbRef = useRef(null);

  const nextBtn = useRef(null);
  const prevBtn = useRef(null);

  const timeRunning = 3000;
  const timeAutoNext = 7000;

  function getDailyRandomMovies(list, count = 10) {
    const today = new Date().toISOString().split("T")[0];
    const seed = Number(today.replace(/-/g, ""));
    let result = [];

    for (let i = 0; i < count; i++) {
      result.push(list[(seed + i) % list.length]);
    }
    return result;
  }

  // Fetch popular movies
  const loadMovies = async () => {
    try {
      const res = await fetch(POPULAR_API_URL);
      const data = await res.json();
      const selected = getDailyRandomMovies(data.results, 10);

      // Fetch details for runtime, genres, release year
      const moviesWithDetails = await Promise.all(
        selected.map(async (movie) => {
          try {
            const detailsRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`
            );
            const details = await detailsRes.json();
            return {
              ...movie,
              runtime: details.runtime,
              genres: details.genres,
              release_year: details.release_date?.split("-")[0] || "N/A",
            };
          } catch {
            return { ...movie, runtime: "N/A", genres: [], release_year: "N/A" };
          }
        })
      );

      setMovies(moviesWithDetails);
    } catch (err) {
      console.error("Movie fetch failed", err);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Slider logic
  useEffect(() => {
    if (movies.length === 0) return;

    const slider = sliderRef.current;
    const list = listRef.current;
    const thumbs = thumbRef.current;

    let timeOut;
    let autoNext = setTimeout(() => next(), timeAutoNext);

    const next = () => {
      const sliderItems = list.querySelectorAll(".item");
      const thumbItems = thumbs.querySelectorAll(".item");

      list.appendChild(sliderItems[0]);
      thumbs.appendChild(thumbItems[0]);

      slider.classList.add("next");

      clearTimeout(timeOut);
      timeOut = setTimeout(() => slider.classList.remove("next"), timeRunning);

      clearTimeout(autoNext);
      autoNext = setTimeout(() => next(), timeAutoNext);
    };

    const prev = () => {
      const sliderItems = list.querySelectorAll(".item");
      const thumbItems = thumbs.querySelectorAll(".item");

      list.prepend(sliderItems[sliderItems.length - 1]);
      thumbs.prepend(thumbItems[thumbItems.length - 1]);

      slider.classList.add("prev");

      clearTimeout(timeOut);
      timeOut = setTimeout(() => slider.classList.remove("prev"), timeRunning);

      clearTimeout(autoNext);
      autoNext = setTimeout(() => next(), timeAutoNext);
    };

    nextBtn.current.onclick = next;
    prevBtn.current.onclick = prev;
  }, [movies]);

  return (
    <div className="carousel" ref={sliderRef}>
      {/* Main slider */}
      <div className="list" ref={listRef}>
        {movies.map((movie, index) => (
          <div className="item" key={index}>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
            />
           <div className="content">
  <div className="author">MOVIE</div>
  <div className="title">{movie.title}</div>

  {/* Show rating, release year, runtime */}
  <div className="topic">
    Rating: {movie.vote_average.toFixed(2)} | {movie.release_year} |  {movie.runtime ? timeFormat(movie.runtime) : 'N/A'}
  </div>

  {/* Show genres nicely */}
  {movie.genres?.length > 0 && (
    <div className="des text-red-400">
     Langauge: {movie.original_language.toUpperCase()} • • {movie.genres.map((g) => g.name).join(", ")} 
    </div>
  )}

  <div className="des">{movie.overview}</div>
</div>

          </div>
        ))}
      </div>

      {/* Thumbnail */}
      <div className="thumbnail" ref={thumbRef}>
        {movies.map((movie, index) => (
          <div className="item" key={index}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="content">
              <div className="title">{movie.title}</div>
              <div className="description">Movie</div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="arrows">
        <button ref={prevBtn}>{"<"}</button>
        <button ref={nextBtn}>{">"}</button>
      </div>
    </div>
  );
};

export default HeroSection;
