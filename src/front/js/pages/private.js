import React, { useEffect } from "react";
import rigo from "../../img/rigo-baby.jpg";
import "../../styles/private.css";
import { Link, useNavigate } from "react-router-dom";

const Private = () => {

    const navigate = useNavigate();

    const nombreUsuario = localStorage.getItem("name");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

    }, [])

    return (
        <div className="d-flex justify-content-center align-items-center flex-column mt-4">
            <h3 className="mb-5 text-success">Bienvenido {nombreUsuario}</h3>
            <img src={rigo} className="mb-5" />
            <div className="d-flex">
                <a onClick={handleLogout} className="logout">Cerrar Sesion</a>
            </div>
        </div>
    )
}

export default Private;