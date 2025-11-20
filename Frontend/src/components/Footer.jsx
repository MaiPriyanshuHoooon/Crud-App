import React from 'react'

const Footer = () => {
  return (
    <div className='bg-gray-600 text-white text-center p-4 w-full fixed bottom-0'>
      <p className='text-center font-light'>Copyright@<span className='font-bold'>{new Date().getFullYear()}</span></p>
    </div>
  )
}

export default Footer
