import React, { useState } from "react";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL;

const Login = () => {

	const navigate = useNavigate();

	//Estados
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	//Funciones para asignar valor al estado desde el input
	function setEmailValue(event) {
		const value = event.target.value;
		setEmail(value);
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


	//Funcion para enviar data a la API

	async function enviarData() {
		try {
			const response = await fetch(BACKEND_URL + "api/token",
				{
					method: "POST",
					body: JSON.stringify(
						{
							"email": email,
							"password": password
						}
					),
					headers: {
						'Content-Type': "application/json"
					}
				})

			if (response.status === 500) {
				setMessage("Ocurrio un error, vuelva mas tarde");
				return false;
			}

			if (response.status !== 201) {
				setMessage("Correo electrónico o contraseña incorrecta, vuelve a intentarlo");
				return false;
			}

			const data = await response.json();

			return data;

		} catch (error) {
			setMessage("Ocurrió un error, vuelve a intentarlo más tarde")
			return false
		}

	}


	//Funcion handler para boton login
	async function loginHandler(event) {
		event.preventDefault();

		if (verifyEmail()) {

			const responseData = await enviarData();

			if (responseData === false) {
				window.scrollTo(0, 0);
				return
			}

			const token = responseData.token;
			const name = responseData.name;
			localStorage.setItem("token", token);
			localStorage.setItem("name", name);
			navigate("/private");

		}
		window.scrollTo(0, 0);
		return false
	}


	return (
		<div className="container form-container content">
			{message && (
				<div className="alert alert-danger mb-4 w-100 text-center" role="alert">
					{message}
				</div>
			)}
			<form className="login-form mb-4">
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">Correo Electronico</label>
					<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" autoComplete="off" onChange={setEmailValue} value={email} />
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
					<input type="password" className="form-control" id="exampleInputPassword1" autoComplete="off" onChange={setPasswordValue} value={password} />
				</div>
				<button type="submit" className="btn btn-primary" onClick={loginHandler}>Iniciar Sesion</button>
			</form>
			<div className="d-flex">
				<p>Aun no tienes una cuenta? <Link to={"/signup"}>Registrate</Link></p>
			</div>
		</div>
	);
}

export default Login;