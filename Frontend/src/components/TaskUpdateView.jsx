import * as yup from 'yup'
import { taskCategories } from '../utils/constant'
import { toast } from 'react-toastify'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useState } from 'react'
import { axiosClient } from '../utils/axiosClient'
import LoaderButton from '../components/LoaderButton'
import { useMainContext } from '../context/MainContext'

const TaskUpdateView = ({data,fetchData, close}) => {
    const [loading,setLoading] = useState(false);
    const categories = Object.keys(taskCategories)
    const { fetchAllTasks } = useMainContext();

    const initialValues = {
    title: data.title || '',
    description: data.description || '',
    category: data.category || ''
  }

  const validationSchema = yup.object({
    title: yup.string().required('Title is Required'),
    description: yup.string().required('Description is Required'),
    category: yup.string().required('Category is Required').oneOf(categories, 'Choose Valid Category')
  })

  const onSubmitHandler = async (values, helpers) => {
    try {
        setLoading(true);
        const response = await axiosClient.put(`/task/${data._id}`, values, {
            headers: {
                "user": localStorage.getItem("user") || ""
            }
        });
        const res = response.data;
        toast.success(res.message);
        await fetchAllTasks();
        await fetchData();
        await close();

    } catch (error) {
      toast.error(error.response.data.error || error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
       <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}>

        <Form className="bg-black rounded-xl shadow mx-auto my-10 py-10 px-3">
        <h1 className="text-start text-4xl font-bold mb-8 underline flex justify-center">Update Task</h1>

        <div className="mb-3">
          <label htmlFor="title" className="block mb-1 font-medium text-zinc-200 text-3xl">
            Title
          </label>
          <Field
            name="title"
            type="text"
            className="w-full py-3 px-4 border rounded outline-none text-xl"
            placeholder="Enter Task Title"
          />
          <ErrorMessage
            name="title"
            component={"p"}
            className="text-red-500 mt-1"
          />
        </div>

        <div className="mb-3">
            <label htmlFor="description" className="block mb-1 font-medium text-zinc-200 text-3xl">
              Description
            </label>
            <Field
              as="textarea"
              name="description"
              type="text"
              className="w-full py-3 px-4 border rounded text-xl"
              placeholder="Enter Task Description"
            />
            <ErrorMessage
              name="description"
              component={"p"}
              className="text-red-500 mt-1"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="block mb-1 font-medium text-zinc-200 text-3xl">
              Categories
            </label>
            <Field
              as="select"
              name="category"
              className="w-full py-3 px-4 border rounded text-xl"
            >
              <option value="">-----select-----</option>
              {categories.map((cur, i) => {
                return (
                  <option key={i} value={cur} className="capitalize">
                    {cur}
                  </option>
                )
              })}
            </Field>
            <ErrorMessage
              name="category"
              component={"p"}
              className="text-red-500 mt-1"
            />
          </div>

          {/* <div className="mt-5 text-center">
            <button
              type="submit"
              className="bg-white hover:bg-zinc-600 text-black py-2 px-5 rounded-md transition-all duration-300"
            >
              Add Task
            </button>
          </div> */}
          {/* <button className="mb-3 bg-white hover:bg-zinc-600 text-black py-2 px-5 rounded-md transition-all duration-300 ">
          <LoaderButton isLoading={loading} text={'Add Task'} />
          </button> */}

          <div className="mb-3 ">
            <LoaderButton
              isLoading={loading}
              text={'Update Task'}
              className="bg-zinc-800 text-black hover:bg-zinc-600 disabled:bg-zinc-300"
            />
          </div>


      </Form>
       </Formik>
    </>
  )
}

export default TaskUpdateView;
