import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import axios from "axios";
import Marquee from "react-fast-marquee";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "./Release.css";
import { useNavigate } from "react-router-dom";


// === Testimonial Card Component ===
const TestimonialCard = ({ testimonial }) => (
  <div className="p-4 rounded-lg mx-4 w-72 shrink-0 bg-pink-950/30 border border-pink-950 backdrop-blur-md hover:scale-105 hover:shadow-2xl transition-transform transition-shadow duration-300">
    <div className="flex gap-2 items-center">
      <img className="w-11 h-11 rounded-full" src={testimonial.image} alt={testimonial.name} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="font-semibold">{testimonial.name}</p>

          {/* Verified check */}
          <svg
            className="mt-0.5 animate-pulse"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              fill="#2196F3"
            />
          </svg>
        </div>
        <span className="text-xs text-slate-500">{testimonial.handle}</span>
      </div>
    </div>

    <p className="text-sm pt-4 text-slate-300 line-clamp-3">{testimonial.quote}</p>
  </div>
);



const Release = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/all-movies");
      if (data.success) setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  const testimonialsData = [
    {
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      name: "Olivia Bennett",
      handle: "@oliviashows",
      quote: "Booking tickets was so easy! Seat selection and instant confirmation made our movie night seamless.",
    },
    {
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=80",
      name: "Noah Wilson",
      handle: "@noahplays",
      quote: "Love how real-time seat availability and show listings are — no more sold-out surprises!",
    },
    {
      image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=200&auto=format&fit=crop",
      name: "Emma Davis",
      handle: "@emmatickets",
      quote: "Simple interface and quick checkout — planning a night out with friends was super easy.",
    },
    {
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop",
      name: "Liam Thompson",
      handle: "@liamscreen",
      quote: "Got my tickets in under 5 minutes. Fast, reliable and user-friendly service!",
    },
  ];


 return (
  <>
    {/* New Releases Section */}
    <div className="release-page py-16 bg-black">
      <h1 className="release-title text-4xl md:text-5xl font-bold text-white text-center mb-10">
        New Releases
      </h1>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        className="release-swiper"
        loop
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow]}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id} className="release-slide">
            <img
              className="rounded-xl shadow-lg"
              src={movie.poster_path || "https://via.placeholder.com/260x380?text=No+Image"}
              alt={movie.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* Community / App Section */}
    <div className="max-w-7xl mx-auto p-10 md:p-16 bg-gradient-to-b from-[#301469] to-black rounded-3xl text-center shadow-xl">
    <p className="px-6 py-2 mb-4 text-sm font-semibold rounded-full border border-[#54487B]
bg-gradient-to-r from-[#A992F2] to-[#DFAB9B] bg-clip-text text-transparent
w-max mx-auto">
  Cinion Community
</p>

      <h1 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto mt-3">
        Join 1000+ Movie Lovers{" "}
        <span className="bg-gradient-to-r from-[#A992F2] to-[#DFAB9B] bg-clip-text text-transparent">
          in the Cinion App
        </span>
      </h1>

      <p className="text-white text-sm mt-4 max-w-xl mx-auto">
        Discover the latest movies, book your tickets instantly, and stay updated on upcoming events.
      </p>

      <button
        onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
        className="mt-8 px-12 py-3 rounded-full border border-[#54487B] 
        bg-gradient-to-r from-[#A992F2] to-[#DFAB9B] bg-clip-text text-transparent 
        font-semibold hover:scale-105 transition-transform"
      >
        Book Tickets Now
      </button>
    </div>

    {/* ⭐ NOW TESTIMONIALS ARE OUTSIDE + BELOW COMMUNITY SECTION ⭐ */}
   {/* === Testimonials Section (Centered Like Other Sections) === */}
<div className="max-w-7xl mx-auto px-4 md:px-10 mt-24 mb-10">

  <p className="text-center font-medium text-pink-600 px-10 py-2 rounded-full 
    bg-pink-950/70 border border-pink-800 w-max mx-auto">
    Customer Reviews
  </p>

  <h3 className="text-3xl font-semibold text-center mx-auto mt-4">
    What movie-goers are saying
  </h3>

  <p className="text-slate-300 text-center mt-2 max-w-xl mx-auto">
    Our users love sharing their movie experiences — check out what people say!
  </p>

  {/* Marquee Rows */}
  <Marquee gradient={true} gradientColor="#000" speed={25}>
    <div className="flex items-center justify-center py-5">
      {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
      ))}
    </div>
  </Marquee>

  <Marquee gradient={true} gradientColor="#000" speed={30} direction="right">
    <div className="flex items-center justify-center py-5">
      {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
      ))}
    </div>
  </Marquee>

</div>

  </>
);

};

export default Release;
