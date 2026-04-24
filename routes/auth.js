const express = require("express");
const { register, login, logout } = require("../controllers/authController.js");
const { validationMiddleware } = require("../middlewares/validationMiddleware.js");
const { userSchema } = require("../validators/userValidator.js");
const { loginSchema, registerSchema } = require("../validators/authValidator.js");

const router = express.Router();

router.post("/", [validationMiddleware(loginSchema)], login);
router.post("/register", [validationMiddleware(registerSchema)], register);
router.post("/logout", logout);


module.exports.router = router;