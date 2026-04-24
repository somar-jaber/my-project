
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        req.body.userId = req.params.id;
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // пройти по списку сообщений об ошибках и вывести их все сразу
            const formatted = result.error.format();
            const flatErrors = Object.values(formatted)
                .flat()
                .filter(Boolean)
                .map((err) => err._errors)
                .flat()
            return res.status(400).json({message: flatErrors.join(", ")});
        }

        // очень важно использовать преобразованные данные из ZOD вместо исходных данных
        req.body = result.data;
        next();
    }
}

module.exports.validationMiddleware = validationMiddleware;