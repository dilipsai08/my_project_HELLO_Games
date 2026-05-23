import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../Components/Protected compo/api";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        API.get("/api/check-auth")
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