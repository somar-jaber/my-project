const { prisma } = require("../config/db")

const checkRoleMiddleware = () => {
    return async(req, res, next) => {
        if(req.user.role !== "ADMIN")
            return res.status(401).json(`Error 401 Unauthorized : /checkRoleMiddleware/ : Пользователь имеет право на получение этих данных`);
        next();
    }
}

module.exports.checkRoleMiddleware = checkRoleMiddleware;