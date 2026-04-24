const { logger } = require("../config/logger.js");
const { prisma } = require("../config/db.js");
const { Prisma } = require("@prisma/client");
const bcrypt = require("bcryptjs");


// GET //
const getUsers = async(req, res) => {
  try {
    let users = await prisma.user.findMany();
    return res.status(200).json({
        data: users
    });
  } catch(err) {
    let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
    return res.status(500).json({error: errorMessage});
    logger.error(errorMessage);
  }
}

const getUserById = async(req, res) => {
    try {
        let user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) || null }
        })
        if(!user)
            return res.status(400).json({ error: "Error 400 Bad request: /userController/getuserById : пользователя не существует"});
        
        return res.status(200).json({
            data: user
        });
    } catch(err) {
        let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
        return res.status(500).json({error: errorMessage});
        logger.error(errorMessage);
    }
}



// POST //

const addUser = async(req,res) => {
    try {
        let user = await prisma.user.findUnique({
            where: {email: req.body.email}
        });

        if (user) 
            return res.status(400).json("Error 400 Bad request: /userController/addUser : пользователь уже существует");

        // Хеширование пароля 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = await prisma.user.create({
            data: { 
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email,
                password: hashPassword,
                role: req.body.role || "USER",
                userStatus: req.body.userStatus,
            }
        });

        return res.status(201).json({
            data: user
        });
        
    } catch (err) {
        let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
        return res.status(500).json({error: errorMessage});
        logger.error(errorMessage);
    }
}



const updateUser = async (req, res) => {
    try {

        let user = await prisma.user.findUnique({
          where: { id: Number(req.params.id) },
        }).catch(err => res.status(400).json("Error 400 Bad Request : /userController/updateUser : userId необходимо"));
      
        if (!user) {
          return res.status(404).json({ error: "Error 400 Bad Request: /userController/updateUser : пользователя не существует" });
        }
      
        // Чтобы избежать ошибки, связанной с ограничением, при отправке пользователю одного и того же письма без его обновления
        // To protect from constrain error when we send the same email of the user without updating it
        if (req.body.email === user.email){
            req.body.email = undefined;
        }
        

        const updateData = {};
        // Хеширование пароля 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.dateOfBirth !== undefined) updateData.dateOfBirth = req.body.dateOfBirth;
        if (req.body.email !== undefined) updateData.email = req.body.email;
        if (req.body.password !== undefined) updateData.password = hashPassword;
        if (req.body.role !== undefined) updateData.role = req.body.role;
        if (req.body.userStatus !== undefined) updateData.userStatus = req.body.userStatus;

        user = await prisma.user.update({
          where: { id: Number(req.params.id) },
          data: updateData,
        });
      
        res.status(200).json({
          status: "успех",
          data: {
            user: user,
          },
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
            return res.status(400).json({
                error: `Поле должно быть уникальным: ${err.meta.target}`
            });
            }
        }

        // резервный вариант на случай других ошибок | fallback for other errors
        let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
        return res.status(500).json({error: errorMessage});
        logger.error(errorMessage);
    }
};



const blockUser = async (req, res) => {
    try {
        let user = await prisma.user.findUnique({
          where: { id: Number(req.params.id) },
        }).catch(err => res.status(400).json("Error 400 Bad Request : /userController/updateUser : userId необходимо"));
      
        if (!user) {
          return res.status(404).json({ error: "Error 400 Bad Request: /userController/updateUser : пользователя не существует" });
        }

        if (req.user.role !== "ADMIN" && req.user.id !== user.id)
            return res.status(401).json("error 401 unauthorized /userController/unBlockUser: Блокировать этого пользователя могут только администратор и сам пользователь");  // Only admin and user itself can operate blocking on this user


        user = await prisma.user.update({
          where: { id: Number(req.params.id) },
          data: {userStatus: "INACTIVE"},
        });

        res.status(200).json({
          status: "успех",
          data: {
            user: user,
          },
        });

    } catch(err) {
        let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
        return res.status(500).json({error: errorMessage});
        logger.error(errorMessage);
    }
}


const unBlockUser = async (req, res) => {
    try {
        let user = await prisma.user.findUnique({
          where: { id: Number(req.params.id) },
        }).catch(err => res.status(400).json("Error 400 Bad Request : /userController/updateUser : userId необходимо"));
      
        if (!user) {
          return res.status(404).json({ error: "Error 400 Bad Request: /userController/updateUser : пользователя не существует" });
        }

        if (req.user.role !== "ADMIN" && req.user.id !== user.id)
            return res.status(401).json("error 401 unauthorized /userController/unBlockUser: Блокировать этого пользователя могут только администратор и сам пользователь");  // Only admin and user itself can operate blocking on this user


        user = await prisma.user.update({
          where: { id: Number(req.params.id) },
          data: {userStatus: "ACTIVE"},
        });

        res.status(200).json({
          status: "успех",
          data: {
            user: user,
          },
        });

    } catch(err) {
        let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
        return res.status(500).json({error: errorMessage});
        logger.error(errorMessage);
    }
}




// DELETE //

const removeUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!user) {
    return res.status(404).json("Error 400 Bad Request: /userController/removeUser : пользователя не существует");
  }

  await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });

  res.status(200).json({
    status: "успех",
    message: "пользователь был удален",
  });
};


const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id)}
        })
        if(!user)
            return res.status(400).json({ error: "Error 400 Bad request: /userController/getuserById : пользователя не существует"});
        
        return res.status(200).json({
            data: user
        });
    } catch(err) {
        let errorMessage = `Error 500 /userController/addUser : ${err.message}`;
        return res.status(500).json({error: errorMessage});
        logger.error(errorMessage);
    }
}

module.exports.addUser = addUser;
module.exports.getUsers = getUsers;
module.exports.getUserById = getUserById;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.getMe = getMe;
module.exports.blockUser = blockUser;
module.exports.unBlockUser = unBlockUser;
