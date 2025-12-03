import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { dateFormat } from '../../library/dateFormat'
import { useAppContext } from '../../context/AppContext'


const ListBooking = () => {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (user) getAllBookings()
  }, [user]);

  if (isLoading) return <Loading />

  return (
    <>
      <Title text1="Admin" text2="Bookings" />
      <div className='max-w-4xl mt-6 overflow-x-auto border border-primary/40 rounded-lg'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-sm'>
          <thead className='font-bold'>
            <tr className='bg-primary/20 text-left text-primary'>
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {bookings.length > 0 ? bookings.map((item, index) => {
              const userName = item.user?.name || "Unknown User"
              const movieTitle = item.show?.movie?.title || "Untitled Movie"
              const showTime = item.show?.showDateTime ? dateFormat(item.show.showDateTime) : "N/A"
              const seats = item.bookedSeats ? Object.values(item.bookedSeats).join(", ") : "None"
              const amount = item.amount || 0

              return (
                <tr key={item._id || index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/20'>
                  <td className='p-2 min-w-45 pl-5 font-medium'>{userName}</td>
                  <td className='p-2'>{movieTitle}</td>
                  <td className='p-2'>{showTime}</td>
                  <td className='p-2'>{seats}</td>
                  <td className='p-2'>{currency} {amount}</td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">No bookings available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ListBooking
