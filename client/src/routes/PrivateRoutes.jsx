import React, { Suspense } from "react";
import { Navigate, Outlet,replace,Route,Routes } from "react-router-dom";


const PrivateRoutes = () => {

    const token = localStorage.getItem("token");
    return token ? ( <Outlet /> ) : ( <Navigate to="/login" replace /> );
 
};
export default PrivateRoutes;
