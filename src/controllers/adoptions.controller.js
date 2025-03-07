import { adoptionsService, petsService, usersService } from "../services/index.js";
import mongoose from "mongoose";

const getAllAdoptions = async (req, res) => {

    try {

        req.logger.info("Obteniendo todas las adopciones");
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result });

    } catch (error) {
        req.logger.error(`Error al obtener adopciones: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};

const getAdoption = async (req, res) => {

    try {

        const adoptionId = req.params.aid;

        if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
            req.logger.warning(`ID inválido: ${adoptionId}`);
            return res.status(400).json({ status: "error", error: "ID de adopción inválido" });
        }

        req.logger.info(`Buscando adopción con ID: ${adoptionId}`);

        const adoption = await adoptionsService.getBy({ _id: adoptionId });
        if (!adoption) {
            req.logger.warning(`Adopción con ID ${adoptionId} no encontrada`);
            return res.status(404).send({ status: "error", error: "Adoption not found" });
        }

        req.logger.info(`Adopción encontrada: ${JSON.stringify(adoption)}`);
        res.send({ status: "success", payload: adoption });

    } catch (error) {

        req.logger.error(`Error al obtener adopción: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });

    }
};

const createAdoption = async (req, res) => {

    try {
        const { uid, pid } = req.params;
        
        if (!uid || !pid || !mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(pid)) {

            req.logger.warning("IDs inválidos o faltantes");

            return res.status(400).json({ status: "error", error: "Faltan parámetros de usuario o mascota" });
        }

        const user = await usersService.getUserById(uid);
        if (!user) {
            req.logger.warning(`Usuario con ID ${uid} no encontrado`);
            return res.status(404).send({ status: "error", error: "User not found" });
        }

        const pet = await petsService.getBy({ _id: pid });
        if (!pet) {
            req.logger.warning(`Mascota con ID ${pid} no encontrada`);
            return res.status(404).send({ status: "error", error: "Pet not found" });
        }

        if (pet.adopted) {
            req.logger.warning(`La mascota ${pid} ya está adoptada`);
            return res.status(400).send({ status: "error", error: "Pet is already adopted" });
        }


        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets });
        await petsService.update(pet._id, { adopted: true, owner: user._id });


        await adoptionsService.create({ owner: user._id, pet: pet._id });

        req.logger.info(`Adopción creada con éxito - Usuario: ${uid}, Mascota: ${pid}`);
        res.send({ status: "success", message: "Pet adopted" });

    } catch (error) {
        req.logger.error(`Error al crear adopción: ${error.message}`);
        return res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};


export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}