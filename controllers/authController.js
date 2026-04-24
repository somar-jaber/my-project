const { prisma } = require("../config/db.js");
const { logger } = require("../config/logger.js");
const { generateToken } = require("../utils/generateToken.js");
const bcrypt = require("bcryptjs");
const { checkUserStatus } = require("../utils/checkUserStatus.js");

const register = async(req, res) => {    
    try {

        // проверить, существует ли пользователь 
        const userExists = await prisma.user.findUnique({
            where: {email: req.body.email}
        });
    
        if (userExists || null) 
            return res.status(400).json({error: "Error 400 /authController/register : Этот пользователь уже существует"});
        
        if (!req.body.password)
            return res.status(400).json({error: "Error 400 /authController/register : требуется ввести пароль"});


        // Хеширование пароля 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
    
        // Создание пользователя
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                dateOfBirth: req.body.dateOfBirth,
                password: hashPassword,
                role: req.body.role,
                userStatus: req.body.userStatus,
            },
        }).catch(err => {
            res.status(500).json(`Error 500 Internal Server error: auth/register`);
            logger.error(`Prisma error: ${err.message}`);
            throw err;
        });
    
        // Создать токен JWT
        const token = generateToken(user.id, res);
    
        return res.status(201).json({
            status: "201 /auth/register : Success | Успех",
            data: { 
                user : {id: user.id},
                name: user.name,
                email: user.email,
            },
            token: token,
        });
    } catch(err) {
        res.status(500).json(`Error 500 internal server error : /authController/register`)
        console.log(err.message);
        logger.error();
    }
}


// входa
const login = async(req, res) => {
    const user = await prisma.user.findUnique({
        where: {email: req.body.email}
    })

    if (!user || null) 
        return res.status(401).json({error: "Error 401 /auth/login : Неверный электронной почты или пароль"});
    
    checkUserStatus(user, res);

    // подтвердить пароль 
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid || null) 
        return res.status(401).json({error: "Error 401 /auth/login : Неверный электронной почты или пароль"});


    // Создать токен JWT
    const token = generateToken(user.id, res);


    return res.status(201).json({
        status: "201 /auth/login : Success | Успех",
        data: { 
            user : {id: user.id},
            email: user.email,
        },
        token: token,
    });
}


// выхода - удаление токена и файлов cookie
const logout = async(req, res) => {
    res.cookie("jwt", "", {expires: new Date(0)})
    return res.status(201).json({
        status: "201 /auth/logout : Success | Успех",
        message: "Выход из системы завершён"
    });
}


module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
