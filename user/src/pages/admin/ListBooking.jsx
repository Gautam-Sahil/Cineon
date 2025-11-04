import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { dateFormat } from '../../library/dateFormat'

const ListBooking = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'
   
     const [bookings, setbookings] = useState([])
     const [isloading, setIsLoading] = useState(true)

const getAllShows = async () => {
  setbookings(dummyBookingData)
  setIsLoading(false)
};
   useEffect(() =>{
    getAllShows();
   },[]);
   
  return !isloading ? (
    <>
    <Title text1="Admin" text2="Bookings" />
    <div className='max-w-4xl mt-6 overflow-x-auto border border-primary/40 rounded-lg'>
      <table className='w-full border-collapse rounded-md overflow-hidden text-sm '>
           <thead className='font-bold' >
              <tr className='bg-primary/20 text-left text-primary'>
                <th className="p-2 font-medium pl-5">User Name</th>
                <th className="p-2 font-medium">Movie Name</th>
                <th className="p-2 font-medium">Show Time</th>
                <th className="p-2 font-medium3">Seats</th>
                 <th className="p-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className='text-sm '>
              {bookings.map((item, index) =>(
                <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/20'>
                  <td className='p-2 min-w-45 pl-5 font-medium '>{item.user.name}</td>
                  <td className='p-2'>{item.show.movie.title}</td>
                  <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                  <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                  <td className='p-2'>{currency} {item.amount}</td>
                </tr>
              ))}
            </tbody>
      </table>

    </div>
    </>
  ):(
    <Loading/>
  )
}

export default ListBooking