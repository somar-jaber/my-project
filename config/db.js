const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: process.env.NODE_ENV == "development" ? ["query", "error", "warn"] : ["error"]
});

// to connect to the database 
const connectDB = async() => {
    try {
        await prisma.$connect();
        console.log("DB connected via Prisma");
        console.log("База данных, подключенная через Prisma");
    } catch (error) {
        console.error(`Ошибка подключения к базе данных`);
        console.error(`Database connection Error : ${error.message}`);
        process.exit(1);
    }
}

// отключиться от базы данных 
const disconnectDB = async() => {
    await prisma.$dissconnect();
}

module.exports.prisma = prisma;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;
