import program from "../utils/commander.js";
import dotenv from "dotenv";



if(process.env.NODE_ENV === 'testing')
    {
    dotenv.config({ path: './.env.testing' });
} else {
    const { mode } = program.opts();
    dotenv.config({
        path: mode === "development" ? "./.env.development" : "./.env.production"
    });
}



export default{
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL
}