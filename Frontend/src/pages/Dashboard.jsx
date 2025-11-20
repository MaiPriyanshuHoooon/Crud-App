import TaskCard from '../components/TaskCard'
import { CiSearch } from 'react-icons/ci';
// import { toast } from 'react-toastify';
// import { axiosClient } from '../utils/axiosClient';
// import { useState } from 'react';
// import { useEffect } from 'react';
import { useMainContext } from '../context/MainContext';
import { useState } from 'react';

const Dashboard = () => {
  const {tasks} = useMainContext();
  const [search, setSearch] = useState('');

  const filterResults = tasks.length>0 ? tasks.filter((curr,index) =>{
    const x = search.toLowerCase();
    const y = curr.title.trim().toLowerCase();
    const z = curr.description.trim().toLowerCase();

    return y.includes(x) || y.startsWith(x) || y.endsWith(x) || z.includes(x) || z.startsWith(x) || z.endsWith(x) }) : [];

  return (
    <div>

       <div className="mb-3 flex items-center justify-center bg-black hover:shadow outline-none px-2 py-2 rounded-md w-[81%] mx-auto">
        <CiSearch className="text-4xl" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value = {search}
          type="text"
          placeholder="Search Task"
          className="w-full py-3 px-4 outline-none text-2xl text-zinc-300"
        />
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-[97%] lg:w-[80%] mx-auto  py-10" >
        {
          filterResults.length>0 ? filterResults.map((curr, index) => {
            return <TaskCard data={curr} key={index} />
          }):
          <>

            <h1 className="text-3xl font-semibold text-center col-span-3">No Tasks Found</h1>
            {/* <button
              onClick={fetchAllTasks}
              className="bg-black text-white px-4 py-2 rounded-full w-fit mx-auto"
            >
              Fetch Tasks
            </button> */}
          </>
        }
      </div>
    </div>
  )
}

export default Dashboard
