export const generateUserErrorInfo = (user) => {
    return `Los datos estan incompletos o no son válidos.
    Necesitamos recibir los siguientes datos:
    *Nombre : Necesita ser String, pero recibimos ${user.first_name}
    *Apellido : Necesita ser String, pero recibimos ${user.last_name}
    *Email : Necesita ser String, pero recibimos ${user.email}`
};

export const generateUserNotFoundErrorInfo = (userId) => {
    return `Error: Usuario no encontrado
    ID de usuario solicitado: ${userId}
    Este ID no corresponde a ningún usuario en la base de datos.
    Verifique que el ID esté correctamente escrito o intente con otro ID.`;
}