// src/components/admin/DateTimeSelector.jsx
import React, { useRef } from 'react'
import { CalendarDays, X } from 'lucide-react'

const DateTimeSelector = ({
  dateTimeInput,
  setDateTimeInput,
  handleDateTimeAdd,
  dateTimeSelection,
  handleRemoveTime,
}) => {
  const inputRef = useRef(null)

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-2 text-gray-200">
        Select Date and Time
      </label>

      <div className="inline-flex items-center gap-3 border border-gray-600 p-2 rounded-lg bg-gray-800/40">
        <input
          ref={inputRef}
          type="datetime-local"
          value={dateTimeInput}
          onChange={(e) => setDateTimeInput(e.target.value)}
          className="bg-gray-900 text-gray-100 rounded-md px-2 py-2 outline-none border border-gray-700 focus:ring-2 focus:ring-primary/50 cursor-pointer"
        />
        <button
          type="button"
          onClick={handleDateTimeAdd}
          className="bg-primary/80 text-white px-3 py-2 text-sm rounded-md hover:bg-primary transition"
        >
          Add Time
        </button>
      </div>

      {/* Display selected times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-4 space-y-3">
          {Object.entries(dateTimeSelection).map(([date, times]) => (
            <div key={date}>
              <p className="text-gray-300 font-medium flex items-center gap-2 mb-1">
                <CalendarDays className="w-4 h-4 text-primary" /> {date}
              </p>
              <div className="flex flex-wrap gap-2">
                {times.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-sm text-gray-100"
                  >
                    <span>{time}</span>
                    <button
                      onClick={() => handleRemoveTime(date, time)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateTimeSelector
