const {
    createStudent,
    fetchAllStudent,
    fetchStudentById,
    updateStudentById,
    deleteStudentById } = require('../services/studentService');

const addStudent = async (req, res, next) => {
    const { prefix, firstName, lastName, mobile, email } = req.body
    try {
        const newStudent = await createStudent({
            prefix,
            firstName,
            lastName,
            mobile,
            email
        })
        res.status(201).json({
            message: "New Student Created Successfully!",
            student: newStudent
        })
    } catch (err) {
        next(err)
    }
}

const retrieveStudents = async (req, res, next) => {
    try {
        const students = await fetchAllStudent();
        res.status(200).json(students)
    } catch (err) {
        next(err)
    }
}

const retrieveStudentById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const student = await fetchStudentById(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        };

        res.status(200).json({ student });
    } catch (err) {
        next(err)
    }
}


const updateStudent = async (req, res, next) => {
    const { id } = req.params;
    const { prefix, firstName, lastName, email, mobile } = req.body;

    try {
        const updated = await updateStudentById(id, {
            prefix,
            firstName,
            lastName,
            email,
            mobile
        });

        if (!updated) return res.status(404).json({ message: "Student not found!" })

        res.status(200).json({
            message: `${updated.firstName}'s data updated successfully!`,
            student: updated
        });

    } catch (error) {
        next(error);
    }


};


const deleteStudent = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleted = await deleteStudentById(id);

        if (!deleted) return res.status(404).json({ message: "Student not found!" })

        res.status(200).json({
            message: `${deleted.firstName}'s data, deleted successfully!`,
            student: deleted
        })
    } catch (error) {
        next(error);
    }
}


module.exports = {
    addStudent,
    retrieveStudents,
    retrieveStudentById,
    updateStudent,
    deleteStudent
}