import React from 'react'
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from './context/Auth';

const PublicRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // If user is logged in, redirect to home or dashboard
    return user ? <Navigate to="/" /> : children;
}

export default PublicRoute;
