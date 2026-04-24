const express = require("express");
const { addUser, getUserById, getUsers, updateUser, removeUser, getMe, blockUser, unBlockUser } = require("../controllers/userController.js");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { validationMiddleware } = require("../middlewares/validationMiddleware");
const { userSchema, updateUserSchema } = require("../validators/userValidator");
const { checkRoleMiddleware } = require("../middlewares/checkRoleMiddleware.js");
const router = express.Router();

// Промежуточное ПО для всех маршрутов здесь
router.use(authMiddleware);

router.get("/me", getMe);
router.get("/", checkRoleMiddleware(), getUsers);
router.get("/:id", checkRoleMiddleware(), getUserById);

router.post("/", [checkRoleMiddleware(), validationMiddleware(userSchema)] , addUser);
router.post("/block/:id", [validationMiddleware(userSchema)] , blockUser);
router.post("/unblock/:id", [validationMiddleware(userSchema)] , unBlockUser);

router.put("/:id", [checkRoleMiddleware(), validationMiddleware(updateUserSchema)] , updateUser);
router.delete("/:id", [checkRoleMiddleware(), validationMiddleware(updateUserSchema)] , removeUser);



module.exports.router = router;