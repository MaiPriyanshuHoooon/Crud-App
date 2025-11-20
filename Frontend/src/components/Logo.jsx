import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="w-11 h-11 text-white p-2 bg-black rounded-full"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span className="ml-3 text-xl text-white">Task App</span>
      <span className="w-2.5 h-2.5 bg-white ml-1.5 animate-spin"></span>
    </Link>
  );
};

export default Logo;
