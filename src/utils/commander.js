import { Command } from "commander";

const program = new Command();

if (process.env.NODE_ENV !== 'testing') {

    program
        .option("-p <port>", "puerto en donde se ejecuta el servidor", 8080)
        .option("--mode <mode>", "modo de trabajo", "development")
        .parse();
}


export default program; 