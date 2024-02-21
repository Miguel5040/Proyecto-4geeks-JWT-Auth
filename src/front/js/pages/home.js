import React from "react";
import rigo from "../../img/rigo-baby.jpg";
import { Link } from "react-router-dom";

const Home = () => {

    return (
        <div className="d-flex justify-content-center align-items-center flex-column mt-4">
            <h3 className="mb-5">Aplicacion y Proyecto 4geeks JWT</h3>
            <img src={rigo} className="mb-5" />
            <div className="d-flex">
                <p>Crea una cuenta con nosotros <Link to={"/signup"}>Haz click aqui</Link></p>
            </div>
        </div>
    )
}

export default Home;