import EErrors from "../services/errors/enums.js";

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {

        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).json({
                status: "error",
                error: error.name,
                message: error.message,
                cause: error.cause
            });

        case EErrors.ROUTING_ERROR:
            return res.status(404).json({
                status: "error",
                error: "Ruta no encontrada",
                message: error.message || "La ruta solicitada no existe",
                cause: error.cause || `Intento de acceso a: ${req.originalUrl}`
            });


        default:

            return res.status(500).json({
                status: "error",
                error: "Error desconocido",
                message: error.message || "Ocurrió un error en el servidor",
                cause: error.cause || "No se pudo determinar la causa"
            });
    }
}

export default errorHandler;