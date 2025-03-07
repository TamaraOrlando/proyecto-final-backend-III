import MockingService from '../services/mocking.js';

const getMockingPets = async (req, res) => {
    try {
        req.logger.info("Generando 10 mascotas de prueba");
        const pets = await MockingService.generatePets(10);
        req.logger.info("Mascotas de prueba generadas con éxito.");
        res.send({ status: 'success', payload: pets });

    } catch (error) {
        req.logger.error(`Error al generar mascotas de prueba: ${error.message}`);
        res.status(500).send({ status: 'error', message: 'Error al generar mascotas.' });
    }
};

const getMockingUsers = async (req, res) => {
    try { 
        req.logger.info("Generando 50 usuarios de prueba");
        const users = await MockingService.generateUsers(50);
        req.logger.info("Usuarios de prueba generados con éxito.");
        res.send({ status: 'success', payload: users });

    } catch (error) { 
        req.logger.error(`Error al generar usuarios de prueba: ${error.message}`);
        res.status(500).send({ status: 'error', message: 'Error al generar usuarios.' });
    }
};



const generateData = async (req, res) => {
    try { 
        const { users, pets } = req.query;
    
        if (users && isNaN(users)) {
            req.logger.warning("Se recibió un valor inválido para 'users'");
            return res.status(400).send({ status: 'error', error: 'Invalid number of users' });
        }
    
        if (pets && isNaN(pets)) {
            req.logger.warning("Se recibió un valor inválido para 'pets'");
            return res.status(400).send({ status: 'error', error: 'Invalid number of pets' });
        }
    
        req.logger.info(`Generando datos de prueba - Usuarios: ${users || 0}, Mascotas: ${pets || 0}`);
        await MockingService.generateData(req, res);
        req.logger.info("Datos de prueba generados con éxito.");

    } catch (error) { 
        req.logger.error(`Error al generar datos de prueba: ${error.message}`);
        res.status(500).send({ status: 'error', message: 'Error al generar data.' });
    }
};


export default {
    getMockingPets,
    getMockingUsers,
    generateData,
};

