import React, { useState } from 'react'
import BlueCircle from './BlueCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({dateTime, id}) => {
      const navigate = useNavigate();

     const [selectedDate, setSelectedDate] = useState(null);

     const onBookHandler = () => {
        if(!selectedDate) {
            return toast.error("Please select a date to proceed");
        }
         navigate(`/movies/${id}/${selectedDate}`);
         scrollTo(0,0);
        }

  return (
    <div id='dateSelect' className='pt-30'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/15 border border-primary/30 rounded-lg'>
        <BlueCircle top='-100px' left='-100px'/>
        <BlueCircle top='100px' left='0px'/>
        <div>
            <p className='text-lg font-semibold'>Choose Date</p>
            <div className='flex items-center gap-6 text-sm mt-5 overflow-x-auto no-scrollbar'>
                <ChevronLeftIcon width={28}/>
                <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg'></span>
              {Object.keys(dateTime).map((date) => (
                <button onClick={()=>selectedDate(date)} key={date} className={` flex flex-col items-center justify-center h-14 w-14 aspect-square  rounded font-medium cursor-pointer active:scale-95 transition ${selectedDate === date ? 'bg-primary text-white' : 'border border-primary/70'}`} >
                  <span>{new Date(date).getDate()}
                    </span> 
                 <span>{new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                    </span> 
                    
                </button>
              ))}<span/>
                <ChevronRightIcon  width={28}/>
            </div>
        </div>
        <button onClick={onBookHandler} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>Book Now</button>
      </div>

    </div>
  )
}

export default DateSelect