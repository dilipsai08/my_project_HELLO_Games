import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/api/check-auth", {
            withCredentials: true 
        })
            .then(response => {
                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(error => {
                setIsAuthenticated(false);
            });
    }, []);
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return children;
    }
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;  