const { z } = require("zod");

const registerSchema = z.object({
    name: z.string({error: "\nname должно быть string"}),  
    dateOfBirth: z.iso.date({error: "\nError 400 /userValidator/: dateOfBirth Дата рождения должна соответствовать этому формату : гггг-мм-дд"}),
    email: z.email({error: "\nError 400 /userValidator/ : email Адрес электронной почты должен соответствовать стандартному формату"}),
    password: z.string({error: "пароль должен быть строкой"}),
});

const loginSchema = z.object({
    email: z.email({error: "\nError 400 /userValidator/ : email Адрес электронной почты должен соответствовать стандартному формату"}),
    password: z.string({error: "пароль должен быть строкой"}),
});

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
