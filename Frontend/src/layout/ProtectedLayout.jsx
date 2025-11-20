import React from 'react'
import { Outlet } from 'react-router-dom'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../components/LoaderComponent';
import { useMainContext } from '../context/MainContext';

const ProtectedLayout = () => {

    const {user} = useMainContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <LoaderComponent/>;
    }

    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default ProtectedLayout
