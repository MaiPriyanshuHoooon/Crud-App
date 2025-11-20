import React from 'react'
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import { useState } from 'react';
import LoaderButton from '../components/LoaderButton';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import {axiosClient} from '../utils/axiosClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';

const loginPage = () => {

  const [isHide, setIsHide] = useState(true);
  const navigate = useNavigate();
  const {fetchProfile} = useMainContext();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async(values, helpers) => {
    try {
      setIsLoading(true);

      const response = await axiosClient.post('/login', values);
      const data = await response.data;

      toast.success(data.message);
      localStorage.setItem('user', data.token);
      helpers.resetForm();
      await fetchProfile();
      navigate('/');

    } catch (error) {
      toast.error(error?.response?.data?.error|| error.message);

    } finally {
      setIsLoading(false);
    }
    // console.log('Form Values:', values);
  }

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
  });

  const initialValues = {
    name: "",
    email: "",
    password: ""
  };

  return (
    <div className='min-h-[80vh] flex justify-center items-center'>
      <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
      >

      <Form className='w-[96%] md:w-1/2 lg:w-1/3 bg-zinc-800 shadow p-8 rounded-lg '>
      <div className='flex items-center justify-center mb-3 '>
          <Logo />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label inline-block  text-white">Email</label>

          <Field name = "email" type="email" className="rounded-full form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="email" placeholder="Enter email" />

          <ErrorMessage name='email' component="div" className='text-red-500'/>
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="form-label inline-block  text-white">Password</label>

          <div className="rounded-full form-control w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600  flex">
          <Field name = "password" type={isHide?"password": "text"}  id="password" className="w-full focus:outline-none" placeholder="Enter password" />
          <button onClick={()=>setIsHide(!isHide)}className='text-zinc-500 type="button cursor-pointer'>
            {isHide? "Show" : "Hide"}
          </button>
          </div>

          <ErrorMessage name='password' component="div" className='text-red-500'/>
        </div>

        <div className='mb-2'>
          <LoaderButton isLoading={isLoading} text='Login' />
        </div>
        <div className="mb-2">
          <p className='text-end'>
            Don't have an account ? <Link to={'/register'}
            className='font-bold text-white  underline'>Register</Link>
            </p>
        </div>
      </Form>
    </Formik>
    </div>
  )
}

export default loginPage
