import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

export default class MockingService {

   static async generatePets(num) {
        const pets = [];
        for (let i = 0; i < num; i++) {
            const pet = {
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                birthDate: faker.date.past(),
                adopted: false,
            };
            pets.push(pet);
        }
        return pets;
    }

    static async generateUsers(num) {
        const users = [];
        for (let i = 0; i < num; i++) {
            const password = await createHash('coder123');

            const user = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: password,
                role: faker.helpers.arrayElement(['user', 'admin']),
                pets: [],
            };
            users.push(user);
        }
        return users;
    }


   static async generateData(req, res) {
        try {
            const { users, pets } = req.query;

            if (!users && !pets) {
                return res.status(400).send({ status: 'error', message: 'No users or pets count provided' });
            }

            let usersCreated = [];
            let petsCreated = [];


            if (users) {
                usersCreated = await MockingService.generateUsers(parseInt(users));
            }

            if (pets) {
                petsCreated = await MockingService.generatePets(parseInt(pets));
            }


            res.send({
                status: 'success',
                message: 'Data generada y guardada en DB',
                usersCreated: usersCreated.length,
                petsCreated: petsCreated.length,
            });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al generar data' });
        }
    }
}