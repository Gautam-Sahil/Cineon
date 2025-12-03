import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// User Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// User Pages
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Tickets from "./pages/Tickets";
import Seatlayout from "./pages/Seatlayout";
import Favorite from "./pages/Favorite";
import MyBookings from "./pages/Mybooking";
import MoreInfo from "./pages/MoreInfo"; 

// Admin Components / Pages
import Layout from "./pages/admin/Layout";
import Dashboards from "./pages/admin/Dashboards";
import AddShow from "./pages/admin/AddShow";
import ListShows from "./pages/admin/ListShows";
import ListBooking from "./pages/admin/ListBooking";
import { useAppContext } from "../context/AppContext";
import { SignIn } from "@clerk/clerk-react";
import Loading from "./components/Loading";
import Release from "./pages/Release";
import Theatre from "./pages/Theatre";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { user } = useAppContext()
   
  return (
    <>
      {/* Global toaster */}
      <Toaster position="bottom-right" richColors />

      {/* Show Navbar + Footer only on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/movies" element={<Movies />} />
  <Route path="/release" element={<Release />} />
  <Route path="/movies/:id" element={<Tickets />} />
  <Route path="/movies/:id/:date" element={<Seatlayout />} />
  <Route path="/my-bookings" element={<MyBookings />} />
  <Route path="/loading/:nexturl" element={<Loading />} />
  <Route path="/theatre" element={<Theatre/>} />
  <Route path="/favorite" element={<Favorite />} />
        

        <Route path="/moreinfo/:type/:id" element={<MoreInfo />} />

  {/* Admin Routes (all share the same Layout) */}
  <Route path="/admin/*" element={ user ? <Layout />:(
    <div className="min-h-screen flex justify-center items-center">
      <SignIn fallbackRedirectUrl={'/admin'}/>
    </div>
  )}>
    <Route index element={<Dashboards />} />
    <Route path="add-shows" element={<AddShow />} />
    <Route path="list-shows" element={<ListShows />} />
    <Route path="list-bookings" element={<ListBooking />} />
  </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;