const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
    const payload = {id: userId};
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
    );
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Это не позволит браузеру отправлять эти файлы cookie при межсайтовых запросах, что обеспечит защиту от атак CSRF
        maxAge: (1000 * 60 * 60 * 24) * 7   // 7d
    });
    return token;
}

module.exports.generateToken = generateToken;