import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlueCircle from '../../components/BlueCircle'
import { ChartLineIcon, CircleDollarSign, PlayCircle, StarIcon, UserIcon } from 'lucide-react'
import { dateFormat } from '../../library/dateFormat'

const Dashboards = () => {
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
    setDashboardData(dummyDashboardData)
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

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
              <h1 className="text-sm font-medium text-gray-600">{card.title}</h1>
              <p className="text-2xl font-semibold mt-1">{card.value}</p>
            </div>
            <card.icon className="w-8 h-8 opacity-80" />
          </div>
        ))}
      </div>

      {/* === ACTIVE SHOWS === */}
      <p className="mt-10 text-lg font-semibold text-gray-700">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-6xl">
        <BlueCircle top="100px" left="-10%" />
        {DashboardData.activeShows.length === 0 ? (
          <p className="text-gray-500 mt-4">No active shows available.</p>
        ) : (
          DashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="w-56 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 
              border border-primary/20 hover:-translate-y-1 hover:shadow-md transition duration-300"
            >
              <img
                src={show.movie.poster_path}
                alt={show.movie.title}
                className="h-60 w-full object-cover"
              />
              <div className="p-2">
                <p className="font-medium truncate text-gray-800">{show.movie.title}</p>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-medium text-primary">
                    {currency} {show.showPrice}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {show.movie.vote_average?.toFixed(1)}
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {dateFormat(show.showDateTime)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Dashboards
