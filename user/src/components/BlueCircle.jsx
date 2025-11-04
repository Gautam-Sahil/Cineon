import React from 'react'

const BlueCircle = ({ top = "auto", left = "Auto", right = "Auto", bottom = "auto"}) => {
  return (
    <div className='absolute -z-50  h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl overflow-hidden' style={{top: top, left: left, right: right, bottom: bottom}}>
      
    </div>
  )
}

export default BlueCircle
