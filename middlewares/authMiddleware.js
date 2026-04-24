const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");


// Считаем токен из запроса 
// Проверяем, действителен ли токен 

const authMiddleware = async(req, res ,next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt){ 
        // если токен отсутствует в заголовке, мы проверим, есть ли он в файле cookie 
        // if the token is not in the header we will check if it is in the cookie 
        token = req.cookies.jwt;
    } 

    if (!token)  
        return res.status(401).json({error: "Error 401 /authMiddleware : Не авторизовано, токен не предоставлен"}); // Not authorized, no token provided"


    // Проверьте токен и извлеките userId
    try {
        // Проверка действительности токена 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // запрос у пользователя
        const user = await prisma.user.findUnique({
            where: {id: decoded.id}
        });

        if(!user)
            return res.status(401).json({error: "Error 401 /authMiddleware : Пользователя больше нет"});

        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({ error: "Error 401 /authMiddleware : Не авторизовано, ошибка токена" });
    }

}

module.exports.authMiddleware = authMiddleware;