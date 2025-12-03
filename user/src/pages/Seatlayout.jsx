import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import screenImage from '../assets/screenImage.svg'
import Loading from '../components/Loading'
import { ClockIcon } from 'lucide-react'
import isoTimeFormat from '../library/isoTimeFormat'
import BlueCircle from '../components/BlueCircle'
import { toast } from 'sonner';
import { useAppContext } from './context/AppContext'

const Seatlayout = () => {
  
  const groupRows =[['A','B'], ['C','D'], ['E','F'], ['G','H'], ['I','J']]
  const {id, date} = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])


  const {axios, getToken, user} = useAppContext();

  const getShow = async () =>{
   try {
     const { data } = await axios.get(
        `/api/show/${id}`
     )
     if(data.success){
      setShow(data)
     }
   } catch (error) {
    console.log(error)
   }
  }
  const handleSeatClick = (seatId) =>{
    if(!selectedTime){
      return toast.error('Please select a time slot first.')
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast.error('You can select a maximum of 5 seats.')
    }
    if(occupiedSeats.includes(seatId)){
      return  toast.error('the seat is booked')
    }
    setSelectedSeats(prevSeats => prevSeats.includes(seatId) ? prevSeats.filter(seat => seat !== seatId) : [...prevSeats, seatId])
  }

  const renderSeats = (row, counts = 9) =>(
         <div key={row} className='flex gap-2 mb-2'>
          <div className = 'flex flex-wrap gap-2 items-center justify-center'>
            {Array.from({length:counts},(_,index) => {
              const seatId = `${row}${index + 1}`;
              return (
                <button
                  key={seatId}
                  onClick={() => handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-primary/50 cursor-pointer
                  ${selectedSeats.includes(seatId) && 'bg-primary text-white'}
                  ${occupiedSeats.includes(seatId) && 'opacity-50'
                  }`}>
                {seatId}
                </button>
              );
            })}
          </div>
         </div>
              
          )

          const getOccupiedSeats = async ()=>{
            try {
              const {data} = await axios.get(`/api/bookings/seats/${selectedTime.showId}`)
              if(data.success){
                setOccupiedSeats(data.occupiedSeats)
              }else{
                toast.error(data.message)
              }
            } catch (error) {
              console.log(error)
              
            }
          }


          const bookedTickets = async () =>{
            try {
              if(!user) return toast.error('please login first to proceed')

                if(!selectedTime || !selectedSeats.length) return toast.error('please sealect time and seats');

                const {data} = await axios.post('/api/bookings/create', {showId: selectedTime.showId, selectedSeats},  {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        })

        if (data.success){
          toast.loading("Redirecting to payment gateway...")
         window.location.href = data.url;
        }else{
          toast.error(data.message)
        }
            } catch (error) {
              toast.error(error.message)
            }
          }
  useEffect(() =>{
      getShow()
  },[])

  useEffect(() =>{
  if(selectedTime){
    getOccupiedSeats()
  }
  },[selectedTime])
  return show ?(
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      <div className='w-60 bg-primary/10 border border-primary/70 rounded-lg py-10 h-max md:sticky md:top-30'>
         <p className='text-lg font-semibold px-6'>Available Timing</p>
         <div className='mt-5 space-y-1'>{show.dateTime[date].map((item)=>(
          <div  className={`flex items-centre gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
  selectedTime?.time === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20'
}`}
 key={item.time} onClick={() => setSelectedTime(item)}>
            <ClockIcon className='w-4 h-4'/>
            <p className='text-sm'>{isoTimeFormat( item.time)}</p>
            </div>
         ))}

         </div>
      </div>
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
       <BlueCircle top='-100px' left='-100px'/>
         <BlueCircle top='0px' left='0px'/>
         <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
         <img src={screenImage} alt="Screen" />
         <p className='text-gray-400 text-sm mb-6 '>SCREEN SIDE</p>
         <div className='flex flex-col items-center mt-10 text-xs text-gray-300 '>
           <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(rows  => renderSeats(rows))}
             
         
           </div>
     <div className='grid grid-cols-2 gap-11'>
          {groupRows.slice(1).map((group, idx)=>(
          <div key={idx}>
            {group.map(rows => renderSeats(rows))}
          </div>

          ))}

         </div>

         </div>
      <button onClick={bookedTickets} className='flex items-center gap-1  mt-20  bg-primary px-6 py-3 rounded hover:bg-primary-dull transition cursor-pointer active:scale-95 disabled:opacity-50' disabled={selectedSeats.length === 0 || !selectedTime}>
        Proceed to Payment
      </button>
    
      </div>
    </div>
  ):(
    <Loading/>
  )
}

export default Seatlayout