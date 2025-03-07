import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";


const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la API - Adoptame",
            description: "API para la gestión de adopciones de mascotas"
        }
    },
    apis: ["./src/docs/**/*.yaml"] 
};


const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export { swaggerSpecs, swaggerUiExpress };
