const checkUserStatus = (user, res) => {
    if (user.userStatus === "INACTIVE") 
        return res.status(401).json({error: "Error 401 /authController : Пользователь неактивен или заблокирован"});
    return;
}

module.exports.checkUserStatus = checkUserStatus;