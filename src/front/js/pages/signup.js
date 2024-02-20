import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL;

const Signup = () => {

    const navigate = useNavigate();

    //Estados
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [colorMessage, setColorMessage] = useState("alert-danger")

    //Funciones para asignar valor al estado desde el input
    function setEmailValue(event) {
        const value = event.target.value;
        setEmail(value);
    }

    function setNameValue(event) {
        const value = event.target.value;
        setName(value);
    }

    function setPasswordValue(event) {
        const value = event.target.value;
        setPassword(value);
    }

    //Verificaciones
    function verifyEmail() {
        if (email === "" || !email.includes(".com") || !email.includes("@")) {
            setMessage("El correo electronico que proporcionaste es invalido");
            return false;
        }
        return true;
    }

    function verifyName() {
        if (name === "") {
            setMessage("El nombre que proporcionaste es invalido");
            return false;
        }
        return true;
    }

    function verifyPassowrd() {
        if (password.length < 8) {
            setMessage("La contraseña tiene que tener 8 caracteres como minimo");
            return false;
        }
        return true;
    }

    //Funcion para realizar el envio de datos a la API

    async function enviarData() {
        try {
            const response = await fetch(BACKEND_URL + "api/user",
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            "name": name,
                            "email": email,
                            "password": password
                        }
                    ),
                    headers: {
                        'Content-Type': "application/json"
                    }
                });

            if (response.status === 400) {
                setMessage("El correo electrónico ya se encuentra en uso")
                return 400
            }

            if (response.status != 201) {
                setMessage("Ocurrió un error al crear tu cuenta, por favor vuelve a intentarlo más tarde")
                return 500
            }

            return 201

        } catch (error) {
            setMessage("Ocurrió un error, vuelva a intentarlo más tarde");
            window.scrollTo(0, 0);
        }
    }


    //Funcion handler para boton login
    async function signupHandler(event) {
        event.preventDefault();

        if (verifyEmail() && verifyName() && verifyPassowrd()) {

            const statusCode = await enviarData();

            if (statusCode === 201) {
                setMessage("Registro exitoso, redirigiendo a inicio de sesion");
                setColorMessage("alert-success");
                window.scrollTo(0, 0);

                setTimeout(() => {
                    navigate("/");
                }, 3500);
            }

        }
        window.scrollTo(0, 0);

    }


    return (
        <div className="container form-container">
            {message && (
                <div className={"alert mb-4 w-100 text-center " + colorMessage} role="alert">
                    {message}
                </div>
            )}
            <form className="login-form mb-4">
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Correo Electronico</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" autoComplete="off" onChange={setEmailValue} value={email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="exampleInputName" autoComplete="off" onChange={setNameValue} value={name} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" autoComplete="off" onChange={setPasswordValue} value={password} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={signupHandler}>Iniciar Sesion</button>
            </form>
            <div className="d-flex">
            </div>
        </div>
    )
}

export default Signup;