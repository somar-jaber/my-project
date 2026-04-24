 const { z } = require("zod");
 
 const userSchema = z.object({
    userId: z.coerce
        .number()
        .int({error: "\nError 400 /userValidator/ : userId должен быть целым числом"})
        .optional(),
    name: z.string({error: "\nname должно быть string"}),
    dateOfBirth: z.iso.date({error: "\nError 400 /userValidator/: dateOfBirth Дата рождения должна соответствовать этому формату : гггг-мм-дд"}),
    email: z.email({error: "\nError 400 /userValidator/ : email Адрес электронной почты должен соответствовать стандартному формату"}),
    password: z.string({error: "пароль должен быть строкой"}),
    role: z.string()
        .toUpperCase()
        .pipe(
            z.enum(["ADMIN", "USER"], {
            error: () =>
                "\nError 400 /userValidator/ : role должно быть одним из : ADMIN, USER",
            })
        )
        .optional(),
    userStatus: z.string()
        .toUpperCase()
        .pipe(
            z.enum(["ACTIVE", "INACTIVE"],  {error: "\nError 400 /userValidator/ : userStatus должно быть одним из : ACTIVE, INACTIVE"}),
        )
        .optional(),
    
 });
 
 module.exports.userSchema = userSchema;
 module.exports.updateUserSchema = userSchema.partial();  // .deepPartial() → makes nested fields optional too(but it has been deprecated in newer Zod versions)