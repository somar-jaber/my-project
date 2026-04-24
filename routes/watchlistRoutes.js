const express = require("express");
const { addToWatchlist, updateWatchlist,removeFromWatchlist } = require("../controllers/watchlistController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { addToWatchlistSchema } = require("../validators/watchlistValidators");
const { validationMiddleware } = require("../middlewares/validationMiddleware");
const router = express.Router();

// Middleware for all routes here
router.use(authMiddleware);

router.post("/", addToWatchlist);
router.put("/:id", validationMiddleware(addToWatchlistSchema), updateWatchlist);
router.delete("/:id", removeFromWatchlist);


module.exports.router = router; 