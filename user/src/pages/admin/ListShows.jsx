import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlueCircle from '../../components/BlueCircle'
import { CalendarDays, TicketIcon, StarIcon, DollarSign } from 'lucide-react'
import { dateFormat } from '../../library/dateFormat'
import { useAppContext } from '../../context/Appcontext'

const ListShows = () => {

  
      const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'

  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  const getAllShows = async () => {
    try {
        const { data } = await axios.get('/api/admin/all-shows', { headers: { Authorization: `Bearer ${await getToken()}` } });
      setShows(data.shows)
    } catch (error) {
      console.error('Error fetching shows:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    if(user){
        getAllShows()
    }
  
  }, [user])

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
    const totalBookings = show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0;
    const earnings = totalBookings * (show.showPrice || 0);
    const movie = show.movie || {}; // safe fallback

    return (
      <tr
        key={show._id || index}
        className="border-t border-primary/40 hover:bg-primary/10 transition duration-200"
      >
        <td className="px-4 py-3 font-medium">{movie.title || "Untitled Movie"}</td>
        <td className="px-4 py-3">{show.showDateTime ? dateFormat(show.showDateTime) : "N/A"}</td>
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
      {shows.map((show, index) => {
  const movie = show.movie || {};
  const totalBookings = show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0;

  return (
    <div
      key={show._id || index}
      className="rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br 
      from-primary/10 to-primary/5 hover:shadow-md hover:-translate-y-1 transition duration-300"
    >
      <img
        src={movie.poster_path || "/placeholder.jpg"}
        alt={movie.title || "Untitled Movie"}
        className="h-60 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <p className="font-semibold truncate">{movie.title || "Untitled Movie"}</p>

        <div className="flex justify-between text-sm text-gray-400">
          <p className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-primary" />
            {show.showDateTime ? dateFormat(show.showDateTime) : "N/A"}
          </p>
          <p className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            {movie.votes?.toFixed(1) || "N/A"}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm">
          <p className="font-medium text-primary flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> {currency} {show.showPrice || 0}
          </p>
          <p className="flex items-center gap-1 text-teal-300">
            <TicketIcon className="w-4 h-4 text-primary/70" />
            {totalBookings} booked
          </p>
        </div>
      </div>
    </div>
  )
})}

      </div>
    </div>
  )
}

export default ListShows
