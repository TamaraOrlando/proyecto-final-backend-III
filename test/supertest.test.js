import supertest from "supertest";
import { expect } from "chai";
import config from "../src/config/config.js";
import app from "../src/app.js";
import mongoose from "mongoose";



const MONGO_URL = config.MONGO_URL;
const requester = supertest(app);


describe("Testing de la App Web Adoptame", () => {
    before(async () => {
        console.log("Iniciando pruebas...");
        await mongoose.connect(MONGO_URL); 
    });

    after(async () => {
        console.log("Finalizando pruebas...");
        await mongoose.connection.close(); 
    });

    describe("Testing de Adopciones", () => {
        it("Endpoint GET /api/adoptions debe traer todas las mascotas", async () => {

            const { status, _body } = await requester.get("/api/adoptions")

            expect(status).to.equal(200);
            expect(_body.payload).to.be.an("array");

        })

        it("Debe retornar 404 si la ruta no existe", async () => {
            const { status } = await requester.get("/api/adoption/noexiste")

            expect(status).to.equal(404);
        })

        it("Traemos una adopcion por ID", async () => {
            let idAdoption = "679fe15d3a2555ff2966ee14";

            const { status, _body } = await requester.get(`/api/adoptions/${idAdoption}`);
            expect(status).to.equal(200);
            expect(_body.payload).to.have.property("_id").that.equals(idAdoption);
        })

        it("Creamos una adopcion", async () => {
            let uid = "67a00c15e031770d433903b5";
            let pid = "67a00c24e031770d43390420";

            const { status } = await requester.post(`/api/adoptions/${uid}/${pid}`);
            console.log(status);
            expect(status).to.equal(200);

        })

        it("Debe retornar 400 si el ID de adopción es inválido", async () => {
            const invalidAdoptionId = "123"; 
    
            const { status, _body } = await requester.get(`/api/adoptions/${invalidAdoptionId}`);
    
            expect(status).to.equal(400);
            expect(_body.error).to.equal("ID de adopción inválido");
        });

        it("Debe retornar 400 si falta el ID de usuario o el ID de mascota al crear una adopción", async () => {
            const { status, _body } = await requester.post("/api/adoptions/invalidId/invalidId");

            expect(status).to.equal(400);
            expect(_body.error).to.equal("Faltan parámetros de usuario o mascota");
        });
    })
})