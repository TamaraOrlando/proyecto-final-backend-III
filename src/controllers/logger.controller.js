export const loggerController = (req,res) => {
    req.logger.debug("Mensaje de Debug");
    req.logger.http("Mensaje de HTTP");
    req.logger.info("Mensaje de INFO");
    req.logger.warning("Mensaje de Alerta");
    req.logger.error("Mensaje de Error");
    req.logger.fatal("Mensaje de Fatal");
    res.send({status: 'success', message: 'Probando Loggers'});
}