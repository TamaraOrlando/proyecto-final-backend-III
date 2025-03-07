import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async(req,res)=>{
    
    try {

        req.logger.info("Obteniendo todas las mascotas");
        const pets = await petsService.getAll();
        req.logger.info(`Se encontraron ${pets.length} mascotas.`);
        res.send({ status: "success", payload: pets });

    } catch (error) {
        req.logger.error(`Error al obtener mascotas: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};

const createPet = async(req,res)=> {
   
    try {

        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            req.logger.warning("Faltan valores obligatorios al crear una mascota.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }

        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);

        req.logger.info(`Mascota creada con éxito: ${JSON.stringify(result)}`);
        res.send({ status: "success", payload: result });

    } catch (error) {
        req.logger.error(`Error al crear mascota: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};

const updatePet = async(req,res) =>{
   
    try {

        const petUpdateBody = req.body;
        const petId = req.params.pid;

        req.logger.info(`Actualizando mascota con ID: ${petId}`);
        const result = await petsService.update(petId, petUpdateBody);

        req.logger.info(`Mascota actualizada con éxito: ${JSON.stringify(result)}`);
        res.send({ status: "success", message: "Pet updated" });

    } catch (error) {
        req.logger.error(`Error al actualizar mascota: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};

const deletePet = async(req,res)=> {
    
    try {
        const petId = req.params.pid;

        req.logger.info(`Eliminando mascota con ID: ${petId}`);
        await petsService.delete(petId);

        req.logger.info(`Mascota con ID ${petId} eliminada correctamente.`);
        res.send({ status: "success", message: "Pet deleted" });

    } catch (error) {
        req.logger.error(`Error al eliminar mascota: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};

const createPetWithImage = async(req,res) =>{
    
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;
        
        if (!name || !specie || !birthDate) {
            req.logger.warning("Faltan valores obligatorios al crear una mascota con imagen.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }

        if (!file) {
            req.logger.warning("No se subió ninguna imagen.");
            return res.status(400).send({ status: "error", error: "No image uploaded" });
        }

        req.logger.info(`Imagen recibida: ${file.filename}`);

        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });

        const result = await petsService.create(pet);
        req.logger.info(`Mascota con imagen creada con éxito: ${JSON.stringify(result)}`);

        res.send({ status: "success", payload: result });

    } catch (error) {
        req.logger.error(`Error al crear mascota con imagen: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
};


export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}