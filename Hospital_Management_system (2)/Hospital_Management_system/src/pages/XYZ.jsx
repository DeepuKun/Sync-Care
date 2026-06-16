import React from 'react'

const XYZ = () => {
let number = 100231;
let arr = number.toString().split('').map(Number);
  return (
    <div>
      <div className='Upper'>
        <div className='upper_left'></div>
        <div>XYZ</div>
        <div className='number_container'>
        {
            arr.map((digit,index)=>(
                <div key={index} className='upper_middle'>
                    <div className='digitbox'>{digit}</div>
                </div>
            ))
        }
        </div>
        <div className='upper_right'></div>
      </div>
      <div className='Lower'></div>
    </div>
  )
}

export default XYZ
