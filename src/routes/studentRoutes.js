const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddlewares');
const { addStudent,
    retrieveStudents,
    retrieveStudentById,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController')

router.post("/create", authenticate, addStudent);
router.get("/", authenticate, retrieveStudents);
router.get("/:id", authenticate, retrieveStudentById);
router.put("/update/:id", authenticate, updateStudent);
router.delete("/delete/:id", authenticate, deleteStudent);


module.exports = router;