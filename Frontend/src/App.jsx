import React, { useEffect } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import loginPage from './pages/loginPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import errorPage from './pages/errorPage'
import { MainContextProvider } from './context/MainContext'
import { ToastContainer } from 'react-toastify';
import ProtectedLayout from './layout/ProtectedLayout'
import AddTaskPage from './pages/AddTaskPage'
import AOS from 'aos';
import 'aos/dist/aos.css';


const App = () => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div>
        <BrowserRouter>
        <MainContextProvider>
          <ToastContainer />
          <Navbar />
            <Routes>
                <Route Component={ProtectedLayout}>
                  <Route path='/' Component={Dashboard}/>
                  <Route path='/add-task' Component={AddTaskPage}/>
                </Route>
                <Route path='/login' Component={loginPage}/>
                <Route path='/register' Component={Register}/>
                <Route path='/*' Component={errorPage}/>
            </Routes>
          <Footer />
          </MainContextProvider>
        </BrowserRouter>
    </div>
  )
}

export default App
