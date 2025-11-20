// import React from 'react'
// import { BsListTask } from "react-icons/bs";
import Logo from './Logo'
import { Link } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';

const Navbar = () => {

  const { user, logoutHandler } = useMainContext();

  return (
    <div>
      <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <Logo />

        {/* Ternary operator to show Login or Logout based on user state */}
        {!user ? <Link to={'/login'} className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0 cursor-pointer">
            Login
        </Link>:
        (
          <ul className="flex items-center gap-x-2">
            <li>
              <Link to="/add-task"
                className="px-3 py-2.5 bg-black text-white rounded-sm cursor-pointer hover:bg-zinc-600 transition-all duration-300"
              >
                Add Task
              </Link>
            </li>

            <li>
              <button onClick={logoutHandler}
                className="px-4 py-2 bg-black text-white rounded-sm cursor-pointer hover:bg-zinc-600 transition-all duration-300"
              >
                Logout
              </button>
            </li>
          </ul>
        )
        }

      </div>
     </header>

    </div>
  )
}

export default Navbar


