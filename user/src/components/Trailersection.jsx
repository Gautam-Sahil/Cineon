import React, { useState } from 'react';
import { PlayCircleIcon } from 'lucide-react';
import BlueCircle from './BlueCircle';

// Import from your new file
import { trailers, getThumbnail } from './trailersData';


const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(trailers[0]);

  return (
    <>
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
              src={currentTrailer.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
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
          {trailers.map((trailer, index) => (
            <div
              key={index}
              className={` relative cursor-pointer border-2 rounded-lg overflow-hidden transition transform duration-300 ${
                currentTrailer.videoUrl === trailer.videoUrl
                  ? 'border-teal-300'
                  : 'border-rose-600'
              } hover:-translate-y-1`}
              onClick={() => setCurrentTrailer(trailer)}
            >
              <img
                src={getThumbnail(trailer.videoUrl)}
                alt={`Trailer ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 brightness-85 hover:brightness-100"
              />
              <PlayCircleIcon
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 w-12 h-8 text-white opacity-70 transform -translate-x-1/2 -translate-y-1/2 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="flex flex-col items-center text-white pt-12">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-semibold max-w-2xl">
            Subscribe to{' '}
            <span className="bg-gradient-to-t from-indigo-600 to-black p-1 bg-left inline-block bg-no-repeat">
              Cinion Updates
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mt-3">
            Get the latest movie releases, exclusive ticket offers, and updates from Cinion directly to your inbox.
          </p>
        </div>

        <div className="flex items-center justify-center mt-10 border border-slate-700 focus-within:outline focus-within:outline-indigo-600 text-sm rounded-full h-14 max-w-xl w-full">
          <input
            className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-slate-400"
            placeholder="Enter your email address"
            type="email"
          />
          <button className="bg-indigo-600 text-white rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition">
            Subscribe
          </button>
        </div>
      </section>
    </>
  );
};

export default TrailerSection;
