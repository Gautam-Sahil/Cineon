import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlueCircle from '../../components/BlueCircle'
import { CalendarDays, TicketIcon, StarIcon, DollarSign } from 'lucide-react'
import { dateFormat } from '../../library/dateFormat'

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'

  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  const getAllShows = async () => {
    try {
      const data = [
        {
          movie: dummyShowsData[0],
          showDateTime: '2025-06-30T02:30:00.000Z',
          showPrice: 59,
          occupiedSeats: {
            A1: 'user_1',
            B2: 'user_2',
            C2: 'user_3',
            D1: 'user_4',
          },
        },
        {
          movie: dummyShowsData[1],
          showDateTime: '2025-07-05T19:30:00.000Z',
          showPrice: 75,
          occupiedSeats: {
            A1: 'user_1',
            B2: 'user_2',
            C2: 'user_3',
          },
        },
      ]
      setShows(data)
    } catch (error) {
      console.error('Error fetching shows:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllShows()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="space-y-10 relative">
      <Title text1="Admin" text2="List Shows" />
      <BlueCircle top="-80px" left="-40px" />

      {/* === SHOW SUMMARY TABLE === */}
      {shows.length > 0 ? (
        <div className="overflow-x-auto bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg shadow-sm">
          <table className="min-w-full text-left text-sm ">
            <thead className="bg-primary/10 text-primary uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Movie Name</th>
                <th className="px-4 py-3">Show Time</th>
                <th className="px-4 py-3">Total Bookings</th>
                <th className="px-4 py-3">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, index) => {
                const totalBookings = Object.keys(show.occupiedSeats).length
                const earnings = totalBookings * show.showPrice
                return (
                  <tr
                    key={index}
                    className="border-t border-primary/40 hover:bg-primary/10 transition duration-200"
                  >
                    <td className="px-4 py-3 font-medium">{show.movie.title}</td>
                    <td className="px-4 py-3">{dateFormat(show.showDateTime)}</td>
                    <td className="px-4 py-3">{totalBookings}</td>
                    <td className="px-4 py-3">
                      {currency} {earnings}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className=" text-center mt-6">No shows available.</p>
      )}

      {/* === POSTER GRID === */}
      <p className="text-lg font-semibold ">All Shows</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {shows.map((show, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br 
            from-primary/10 to-primary/5 hover:shadow-md hover:-translate-y-1 transition duration-300"
          >
            {/* Movie Poster */}
            <img
  src={show.movie.poster_path}
  alt={show.movie.title}
  className="h-60 w-full object-cover"
/>
           

            {/* Movie Info */}
            <div className="p-4 space-y-2">
              <p className="font-semibold  truncate">
                {show.movie.title}
              </p>

              <div className="flex justify-between text-sm text-gray-400">
                <p className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  {dateFormat(show.showDateTime)}
                </p>
                <p className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {show.movie.vote_average?.toFixed(1) || 'N/A'}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="font-medium text-primary flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> {currency} {show.showPrice}
                </p>
                <p className="flex items-center gap-1 text-teal-300">
                  <TicketIcon className="w-4 h-4 text-primary/70" />
                  {Object.keys(show.occupiedSeats).length} booked
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListShows
