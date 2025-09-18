const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');

router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "You accessed a protected route!", user: req.user })
});

module.exports = router;