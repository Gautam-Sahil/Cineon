import React, { useEffect, useState } from 'react'

import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlueCircle from '../../components/BlueCircle'
import { ChartLineIcon, CircleDollarSign, PlayCircle, StarIcon, UserIcon } from 'lucide-react'
import { dateFormat } from '../../library/dateFormat'
import { useAppContext } from '../../context/AppContext'

import { toast } from 'sonner'

const Dashboards = () => {

    const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'

  const [DashboardData, setDashboardData] = useState({
    activeShows: [],
    totalBookings: 0,
    totalRevenue: 0,
    totalUser: 0,
  })
  const [loading, setLoading] = useState(true)

  const dashboardsCards = [
    {
      title: 'Active Shows',
      value: DashboardData.activeShows.length || 0,
      icon: PlayCircle,
      color: 'from-blue-500/20 to-blue-500/10 border-blue-400/30 text-blue-600',
    },
    {
      title: 'Total Bookings',
      value: DashboardData.totalBookings || 0,
      icon: ChartLineIcon,
      color: 'from-green-500/20 to-green-500/10 border-green-400/30 text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `${currency}${DashboardData.totalRevenue || 0}`,
      icon: CircleDollarSign,
      color: 'from-yellow-500/20 to-yellow-500/10 border-yellow-400/30 text-yellow-600',
    },
    {
      title: 'Total Users',
      value: DashboardData.totalUser || 0,
      icon: UserIcon,
      color: 'from-purple-500/20 to-purple-500/10 border-purple-400/30 text-purple-600',
    },
  ]

const fetchDashboardData = async () => {
  try {
    const { data } = await axios.get("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

   if (data.success) {
  console.log('🧩 Dashboard Data:', data.dashboardata); // <— add this
  setDashboardData(data.dashboardata);
}
 else {
      toast.error(data.message || 'Failed to fetch dashboard data');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error fetching dashboard data');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if(user){
       fetchDashboardData()
    }
   
  }, [user])

  if (loading) return <Loading />

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* === STAT CARDS === */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlueCircle top="-100px" left="0" />
        {dashboardsCards.map((card, index) => (
          <div
            key={index}
            className={`flex items-center justify-between w-full sm:w-[48%] lg:w-[23%] p-5 rounded-xl 
              shadow-sm border backdrop-blur-sm bg-gradient-to-br ${card.color} 
              hover:-translate-y-1 hover:shadow-md transition duration-300`}
          >
            <div>
              <h1 className="text-sm font-medium text-gray-400">{card.title}</h1>
              <p className="text-2xl font-semibold mt-1">{card.value}</p>
            </div>
            <card.icon className="w-8 h-8 opacity-80" />
          </div>
        ))}
      </div>

      {/* === ACTIVE SHOWS === */}
      <p className="mt-10 text-lg font-semibold text-gray-300">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-6xl">
        <BlueCircle top="100px" left="-10%" />
       {DashboardData.activeShows.length === 0 ? (
  <p className="text-gray-400 mt-4">No active shows available.</p>
) : (
  DashboardData.activeShows.map((show) => {
    const movie = show.movie;

    return (
      <div
        key={show._id || movie?.trakt_id}
        className="w-56 rounded-lg overflow-hidden bg-gradient-to-br from-primary/30 to-primary/10 
        border border-primary/50 hover:-translate-y-1 hover:shadow-md transition duration-300"
      >
        {/* Movie Poster */}
        <img
          src={movie?.poster_path || "/placeholder.jpg"} // fallback if missing
          alt={movie?.title || "Untitled Movie"}
          className="h-60 w-full object-cover"
        />

        <div className="p-2">
          {/* Movie Title */}
          <p className="font-medium truncate ">{movie?.title || "Untitled Movie"}</p>

          {/* Price & Rating */}
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-medium text-primary">
              {currency} {show.showPrice || 0}
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              {movie?.votes?.toFixed(1) || "N/A"}
            </p>
          </div>

          {/* Show Date */}
          <p className="text-xs text-gray-400 mt-1">
            {show.showDateTime ? dateFormat(show.showDateTime) : "Date not available"}
          </p>
        </div>
      </div>
    );
  })
)}

      </div>
    </>
  )
}

export default Dashboards
