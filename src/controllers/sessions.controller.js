import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { generateUserErrorInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/custom-error.js";
import EErrors from "../services/errors/enums.js";


const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            req.logger.warning("Intento de registro con valores incompletos.");
            throw CustomError.createError({
                name: "Registro de usuario",
                cause: generateUserErrorInfo({ first_name, last_name, email }),
                message: "Error al intentar registrar usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        req.logger.info(`Intentando registrar usuario con email: ${email}`);

        const exists = await usersService.getUserByEmail(email);

        
        if (exists) {
            req.logger.warning(`Registro fallido: el usuario con email ${email} ya existe.`);
            return res.status(400).send({ status: "error", error: "User already exists" });
        }

        const hashedPassword = await createHash(password);

        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }

        let result = await usersService.create(user);
        req.logger.info(`Usuario registrado con éxito: ID ${result._id}`);
        
        res.status(201).json({ status: "success", payload: result._id });

    } catch (error) {
        req.logger.error(`Error en el registro de usuario: ${error.message}`);
        next(error);
    }
};

const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            req.logger.warning("Intento de login con valores incompletos.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }

        req.logger.info(`Intentando login con email: ${email}`);
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            req.logger.warning(`Login fallido: el usuario con email ${email} no existe.`);
            return res.status(404).send({ status: "error", error: "User doesn't exist" });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            req.logger.warning(`Login fallido: contraseña incorrecta para ${email}.`);
            return res.status(400).send({ status: "error", error: "Incorrect password" });
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

        req.logger.info(`Usuario ${email} autenticado con éxito.`);
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });

    } catch (error) {
        req.logger.error(`Error en login: ${error.message}`);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};

const current = async (req, res) => {
    
    try {
        const cookie = req.cookies['coderCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');

        req.logger.info(`Verificando sesión actual del usuario: ${user.email}`);
        res.send({ status: "success", payload: user });
    } catch (error) {
        req.logger.error(`Error al verificar usuario actual: ${error.message}`);
        res.status(401).send({ status: "error", error: "Unauthorized" });
    }
};

const unprotectedLogin = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            req.logger.warning("Intento de login sin protección con valores incompletos.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }

        req.logger.info(`Intentando login sin protección con email: ${email}`);
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            req.logger.warning(`Login sin protección fallido: el usuario con email ${email} no existe.`);
            return res.status(404).send({ status: "error", error: "User doesn't exist" });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            req.logger.warning(`Login sin protección fallido: contraseña incorrecta para ${email}.`);
            return res.status(400).send({ status: "error", error: "Incorrect password" });
        }

        const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });

        req.logger.info(`Usuario ${email} autenticado sin protección con éxito.`);
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" });

    } catch (error) {
        req.logger.error(`Error en login sin protección: ${error.message}`);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};


const unprotectedCurrent = async (req, res) => {
    
    try {
        const cookie = req.cookies['unprotectedCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');

        req.logger.info(`Verificando sesión sin protección del usuario: ${user.email}`);
        res.send({ status: "success", payload: user });
    } catch (error) {
        req.logger.error(`Error al verificar usuario sin protección: ${error.message}`);
        res.status(401).send({ status: "error", error: "Unauthorized" });
    }
};



export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}