import React, { useState } from "react";
import "../../styles/login.css";
import { Link } from "react-router-dom";

const Login = () => {

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
			return false;
		}
		return true;
	}

	function verifyPassowrd() {
		if (password.length < 8) {
			return false;
		}
		return true;
	}

	//Funcion handler para boton login
	function loginHandler(event) {
		event.preventDefault();

		if (verifyEmail && verifyPassowrd) {
			setMessage("Correo electronico o contraseña incorrecta, vuelva a intentarlo")
		}
		return false
	}


	return (
		<div className="container form-container">
			{message && (
				<div className="alert alert-danger mb-4" role="alert">
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