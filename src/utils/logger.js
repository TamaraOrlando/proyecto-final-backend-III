import winston from "winston";
import config from "../config/config.js";

const NODE_ENV = config.NODE_ENV;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        http: 'cyan',
        info: 'blue',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log', 
            level: 'debug',  
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'info',
            format: winston.format.simple()
        })
    ]
})



const logger = NODE_ENV === "development" ? devLogger : prodLogger;


//Middleware: 
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

export default addLogger;