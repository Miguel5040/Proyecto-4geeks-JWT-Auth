"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from bcrypt import gensalt
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/user', methods=['POST'])
def handle_signup():
    
    # Extraer datos de la peticion HTTP
    data = request.json
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    
    # Verificar datos enviados por el cliente
    if (email is None or 
        name is None or 
        password is None):
        return jsonify({"message": "Falta informacion, verifica tu peticion."}), 400

    if (email == "" or 
        name == "" or 
        password == ""):
        return jsonify({"message": "Datos invalidos, verifica tu peticion"}), 400

    # Verificar contraseña
    if len(password) < 8:
        return jsonify({"message": "Contraseña invalida"}), 400

    # Verificar correo electronico
    if ".com" not in email and "@" not in email:
        return jsonify({"message": "Correo electronico invalido"}), 400

    # Verificar que el email sea unico
    email_exist = User.query.filter_by(email=email).one_or_none()
    if email_exist:
        return jsonify({"message": "Email ya esta en uso"}), 400

    # Creacion de la sal y hash
    salt = str(gensalt(), encoding = 'utf-8')
    password_seasoned = password + salt
    hash = str(generate_password_hash(password_seasoned), encoding = 'utf-8')
    
    # Creacion del usuario
    new_user = User(email = email, name = name, hash = hash, salt = salt)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario registrado con exito"}), 201
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({"message": "Error del servidor"}), 500


@api.route('/token', methods = ['POST'])
def login():
    
    # Extraer datos de la peticion HTTP
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    # Verificar datos enviados por el cliente
    if (email is None or 
        password is None):
        return jsonify({"message": "Falta informacion, verifica tu peticion."}), 400

    if (email == "" or 
        password == ""):
        return jsonify({"message": "Datos invalidos, verifica tu peticion"}), 400
    
    # Verificar que el usuario no exista
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify({"message": "Email no registrado"}), 400
    
    # Verificacion de contraseña
    password = password + user.salt
    hash = user.hash
    validate_password = check_password_hash(hash, password)
    
    # Creacion de token
    try:
        if validate_password:
            token = create_access_token(identity=user.id)
            return jsonify({"message": "token created successfully",
                            "token": token,
                            "name": user.name}), 201
        else:
            return jsonify({"message": "Correo electronico o contraseña incorrecta"}), 401
    except Exception as error:
        print(error)
        return jsonify({"message": "Error del servidor"}), 500
    