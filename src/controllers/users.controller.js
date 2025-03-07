import { usersService } from "../services/index.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/custom-error.js";
import { generateUserNotFoundErrorInfo } from "../services/errors/info.js";

const getAllUsers = async (req, res) => {
   
    try {
        req.logger.info("Obteniendo todos los usuarios...");
        const users = await usersService.getAll();
        req.logger.info(`Se encontraron ${users.length} usuarios.`);
        res.send({ status: "success", payload: users });

    } catch (error) {
        req.logger.error(`Error al obtener usuarios: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};


const getUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;

        if (!userId || userId.length !== 24) {
            req.logger.warning(`Error en parámetro: ID de usuario incorrecto (${userId})`);

            throw CustomError.createError({
                name: "Error en parámetro",
                cause: generateUserNotFoundErrorInfo(userId),
                message: "Error: ID de usuario incorrecto",
                code: EErrors.ROUTING_ERROR
            });
        }
        req.logger.info(`Buscando usuario con ID: ${userId}`);

        const user = await usersService.getUserById(userId);


        if (!user) {
            req.logger.warning(`Usuario con ID ${userId} no encontrado.`)

            throw CustomError.createError({
                name: "Usuario no encontrado",
                cause: generateUserNotFoundErrorInfo(userId),
                message: "Error: El usuario no existe",
                code: EErrors.ROUTING_ERROR
            });
        }

        req.logger.info(`Usuario encontrado: ${JSON.stringify(user)}`);

        res.status(200).json({ status: "success", payload: user });

    } catch (error) {
        req.logger.error(`Error al obtener usuario: ${error.message}`);
        next(error);
    }
};


const updateUser = async (req, res) => {
    
    try {
        const updateBody = req.body;
        const userId = req.params.uid;

        req.logger.info(`Intentando actualizar usuario con ID: ${userId}`);
        const user = await usersService.getUserById(userId);

        if (!user) {
            req.logger.warning(`No se pudo actualizar: el usuario con ID ${userId} no existe.`);
            return res.status(404).send({ status: "error", error: "User not found" });
        }

        await usersService.update(userId, updateBody);
        req.logger.info(`Usuario con ID ${userId} actualizado con éxito.`);
        res.send({ status: "success", message: "User updated" });

    } catch (error) {
        req.logger.error(`Error al actualizar usuario: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};


const deleteUser = async (req, res) => {
    
    try {
        const userId = req.params.uid;
        req.logger.info(`Intentando eliminar usuario con ID: ${userId}`);

        const user = await usersService.getUserById(userId);
        if (!user) {
            req.logger.warning(`No se pudo eliminar: el usuario con ID ${userId} no existe.`);
            return res.status(404).send({ status: "error", error: "User not found" });
        }

        await usersService.delete(userId);
        req.logger.info(`Usuario con ID ${userId} eliminado con éxito.`);
        res.send({ status: "success", message: "User deleted" });

    } catch (error) {
        req.logger.error(`Error al eliminar usuario: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};



export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}