import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import BlueCircle from './BlueCircle';
import { PlayCircleIcon } from 'lucide-react';

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailer
      </p>

      {/* Video Player */}
      <div className="border border-rose-600 relative mt-6 mb-6">
        <BlueCircle top="-100px" right="-100px" />
        {currentTrailer ? (
          <iframe
            width="100%"
            height="540"
            src={currentTrailer.videoUrl.replace('watch?v=', 'embed/')}
            title="Trailer"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="mx-auto max-w-full"
          ></iframe>
        ) : (
          <p className="text-white text-center">Loading trailer...</p>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-10 w-full max-w-[999px] mx-auto">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            className={`relative cursor-pointer border-2 group-hover:not-hover:opacity-60 hover:-translate-y-1 duration-300 transition rounded-lg overflow-hidden  ${
              currentTrailer.videoUrl === trailer.videoUrl
                ? 'border-teal-300'
                : 'border-rose-600'
            }`}
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt={`Trailer ${index + 1}`}
              className="w-full h-full object-cover hover:scale-110  transition-transform duration-300 brightness-85 hover:brightness-100"
            />

            {/* ✅ Play Icon Centered */}
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-12 h-8 text-white opacity-70 transform -translate-x-1/2 -translate-y-1/2 hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
