import React from 'react'
import image from "../assets/image.png"
import image2 from "../assets/appStore.svg"
import BlueCircle from './BlueCircle'

const Footer = () => {
  return (
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 mt-40"
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
      <BlueCircle bottom="600px" right="0px" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                {/* Brand Section */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <h3 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-lime-200 to-emerald-400'>
                        Cinion
                    </h3>
                    <p className="text-sm/7 mt-6">
                        Cinion is a fast and easy ticket booking app for movies, concerts, sports, and events. Book your seats securely and effortlessly.
                    </p>
                </div>

                {/* Company Links */}
                <div className="flex flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-white">Company</h2>
                        <a className="hover:text-slate-500 transition" href="#">About us</a>
                        <a className="hover:text-slate-500 transition" href="#">
                            Tickets <span className="text-xs text-white bg-indigo-600 rounded-md ml-2 px-2 py-1">Book Now!</span>
                        </a>
                        <a className="hover:text-slate-500 transition" href="#">Contact us</a>
                        <a className="hover:text-slate-500 transition" href="#">Privacy policy</a>
                    </div>
                </div>

                {/* Social & App Section */}
                <div>
                   <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
                        <p className="max-w-60">
                            Making every customer feel valued—book tickets easily for any event with Cinion.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4 mt-3">
                            <a href="#" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dribbble size-5 hover:text-indigo-500" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
                                    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
                                    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
                                </svg>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-5 hover:text-indigo-500" aria-hidden="true">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect width="4" height="12" x="2" y="9"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter size-5 hover:text-indigo-500" aria-hidden="true">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube size-6 hover:text-indigo-500" aria-hidden="true">
                                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                                    <path d="m10 15 5-3-5-3z"></path>
                                </svg>
                            </a>
                        </div>

                        {/* App Download Buttons */}
                        <div className="flex items-center gap-4 mt-6">
                            <button aria-label="googlePlayBtn" className="active:scale-95 transition-all" type="button">
                                <img className="md:w-44 w-28" src={image} alt="Google Play Store" />
                            </button>
                            <button aria-label="appleStoreBtn" className="active:scale-95 transition-all" type="button">
                                <img className="md:w-44 w-28" src={image2} alt="Apple App Store" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <p className="py-4 text-center border-t mt-6 border-slate-700">
                Copyright 2025 © <a href="#"></a> All Rights Reserved.&nbsp; Fully Designed and developed by <b>Gautam Tiwari.</b>
            </p>
          
        </footer>
  )
}

export default Footer
