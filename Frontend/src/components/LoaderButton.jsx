import React from 'react'
import { CgSpinner } from 'react-icons/cg';
import { FaArrowRight } from 'react-icons/fa';


const LoaderButton = ({ text, isLoading, type = 'submit', className = '' }) => {
  return (
    <div>
      <button
        type={type}
        disabled={isLoading}
        className={`w-full px-3 py-3 bg-black disabled:bg-white mt-3 rounded-full text-white hover:bg-gray-500 transition cursor-pointer flex justify-center items-center gap-2 ${className}`}
      >
        <span>{text}</span>
        {isLoading ? <CgSpinner className='text-xl animate-spin'/> : <FaArrowRight /> }
      </button>
    </div>
  )
}

export default LoaderButton;
