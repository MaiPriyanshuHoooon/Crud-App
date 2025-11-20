import { taskCategories } from '../utils/constant';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { axiosClient } from '../utils/axiosClient';
import { FaTrash } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { useMainContext } from '../context/MainContext';
// import TaskView from './TaskView';

const TaskViewChild = ({ data, close }) => {
    const category = data.category;
    const categoryClass = taskCategories[category] || taskCategories['Other'];
    const [loading,setLoading] = useState(false);
    const {fetchAllTasks} = useMainContext();


    const deleteHandler = async () => {
        try {
                setLoading(true);
                const response = await axiosClient.delete('/task/'+data._id, {
                    headers: {
                        "user": localStorage.getItem("user") || ""
                    }
                });
                const res = response.data;
                toast.success(res.message);
                await fetchAllTasks();
                await close();

            } catch (error) {j
              toast.error(error?.response?.data?.error || error.message)
            } finally {
              setLoading(false);
            }
    }
  return (
    <>
        <h1 className=" text-black text-3xl font-bold underline capitalize mb-1 ">{data.title}</h1>
        <p className="text-gray-200 text-2xl capitalize mb-2">{data.description}</p>
        <span className={` ${categoryClass}  transition-all duration-300 hover:bg-zinc-600 py-2 text-2xl capitalize mb-2`}>{category}</span>

        <div className="flex justify-end">
          <button disabled = {loading} onClick={deleteHandler} className="bg-black text-white py-2 px-4 rounded-full w-full outline text-2xl cursor-pointer transition-all duration-300 hover:bg-zinc-600 flex items-center justify-center gap-2">Delete {loading? <CgSpinner className='animate-spin'/>: <FaTrash /> }</button>
        </div>
    </>
  )
}

export default TaskViewChild
