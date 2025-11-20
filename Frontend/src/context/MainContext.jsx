// import React from 'react'
import { useContext } from 'react';
import { createContext } from 'react';
import {useState} from 'react';
import {axiosClient} from '../utils/axiosClient';
import { useEffect } from 'react';
import LoaderComponent from '../components/LoaderComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

export const mainContext = createContext();
export const useMainContext = () => useContext(mainContext);

export const MainContextProvider = ({children}) => {

    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);
    const navigate = useNavigate();

      const[tasks,setTasks] = useState([]);
      const fetchAllTasks = async() =>{
        try {
          const response = await axiosClient.get('/all-task', {
            headers:{
              user: localStorage.getItem("user") || ""
            }
          })

          const data = response.data;
          setTasks(data);
          toast.success(data.message);

        } catch (error) {
          toast.error(error.response.data.error || error.message)
        }
      }

    const logoutHandler = () => {
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate('/login')
        setUser(null);
    }

    const fetchProfile = async()=> {
        try {
            setLoading(true);

            const token = localStorage.getItem("user") || '';
            if(!token) return;

            const response = await axiosClient.get('/profile', {
                headers: {
                    user: token
                    // Authorization: `Bearer ${token}`
                }
        });

            const data = await response.data
            setUser(data);

            await fetchAllTasks();

        } catch (error) {
            console.log(error);
        } finally {
    setLoading(false); // Always runs, regardless of success or error
}
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    // useEffect(() => {
    //     console.log('User state updated:', user);
    // }, [user]);

    if(loading) {
        return <div className='flex justify-center items-center min-h-screen'><LoaderComponent/></div>
    }

  return (
    <mainContext.Provider value={{user, logoutHandler, fetchProfile, fetchAllTasks, tasks}}>
        {children}
    </mainContext.Provider>
  )
}


