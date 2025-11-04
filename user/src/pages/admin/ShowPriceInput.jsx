// src/components/admin/ShowPriceInput.jsx
import React from 'react'

const ShowPriceInput = ({ currency, showPrice, setShowPrice }) => {
  return (
    <div className="mt-8">
      <label className="block text-sm font-medium mb-2 text-gray-200">
        Show Price
      </label>
      <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md bg-gray-800/40">
        <p className="text-gray-400 text-sm">{currency}</p>
        <input
          min={0}
          type="number"
          value={showPrice}
          onChange={(e) => setShowPrice(e.target.value)}
          placeholder="Enter Show Price"
          className="bg-gray-900 text-gray-100 rounded-md px-2 py-1 outline-none border border-gray-700 focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  )
}

export default ShowPriceInput;
