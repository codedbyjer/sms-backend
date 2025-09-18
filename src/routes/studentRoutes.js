const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const { addStudent,
    retrieveStudents,
    retrieveStudentById,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController')

router.post("/create", authMiddleware, addStudent);
router.get("/all", authMiddleware, retrieveStudents);
router.get("/:id", authMiddleware, retrieveStudentById);
router.put("/update/:id", authMiddleware, updateStudent);
router.delete("/delete/:id", authMiddleware, deleteStudent)


router.post("/registration", authMiddleware, (req, res) => {
    res.json({ message: "You accessed the students tab!.\n You can now used the CRUD operaton.", user: req.user })
});

module.exports = router;