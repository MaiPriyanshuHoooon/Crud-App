import { FaArrowRight } from 'react-icons/fa';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import TaskUpdateView from './TaskUpdateView';
import TaskViewChild from './TaskViewChild';
import { toast } from 'react-toastify';
import LoaderComponent from './LoaderComponent';
import { axiosClient } from '../utils/axiosClient';
// import { useEffect } from 'react';

const TaskView = ({id}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({});

  const fetchData = async() => {

    try {
        // const response = await fetch(`/api/tasks/${id}`);
        // const data = await response.json();
        setLoading(true);
        // toast.success("fetched task details successfully");
        const response = await axiosClient.get("/task/"+id, {
            headers: {
                user: localStorage.getItem("user") || ""
            }
        });
        const data = await response.data;
        setTask(data);
        // toast.success(data.message);

    } catch (error) {
        toast.error(error.response.data.message || error.message);
    } finally {
        setLoading(false);
    }

  }
  async function open() {
    await fetchData();
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <>
        <button onClick={open} className="px-5 py-2 text-white rounded-full border flex items-center justify-center bg-black cursor-pointer gap-x-2  transition-all duration-300 hover:bg-zinc-600">
            <span>View</span>
            <FaArrowRight />
          </button>

        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 "
            >

              <DialogTitle as="div" className="text-base/7 font-medium text-white">
                <h1>Task {isUpdate ? `Edit` : "Details"} <button onClick={() => setIsUpdate(!isUpdate)} title='update'>
                    {
                        isUpdate ? <FaEye/> : <FaEdit/>
                    }
                    </button></h1>
                <button>
                    <MdClose onClick={close} className='text-2xl text-white absolute top-7 right-6 cursor-pointer'/>
                </button>

              </DialogTitle>


             { loading ?  <>
                        <div className='w-full min-h-[40vh] flex justify-center items-center'>
                            <LoaderComponent/>
                        </div>
             </>: <section className='w-full min-h-[40vh] '>
                    {
                        isUpdate ? <TaskUpdateView data={task} fetchData={fetchData} close={close}/> : <TaskViewChild data={task} close={close}/>
                    }
              </section>
              }
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default TaskView
