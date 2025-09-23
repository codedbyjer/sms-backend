const {
    createStudent,
    fetchAllStudent,
    fetchStudentById,
    updateStudentById,
    deleteStudentById,
} = require('../services/studentService');
const validateIdParams = require('../middlewares/validate');

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
        const { search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
        const result = await fetchAllStudent(
            search,
            page,
            limit,
            sortBy,
            order
        );


        if (result.total === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found.'
            })
        }

        if (search && result.students.length === 0) {
            return res.status(404).json({
                success: false,
                message: `There is no ${search} found in students.`
            });
        }

        if (page > result.totalPages) {
            return res.status(400).json({
                success: false,
                message: `Page ${page} is out of range. Only ${result.totalPages} pages available.`
            });
        }

        res.status(200).json({
            success: true,
            ...result
        })
    } catch (err) {
        next(err)
    }
}

const retrieveStudentById = async (req, res, next) => {
    const id = validateIdParams(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    };

    try {
        const student = await fetchStudentById(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        };

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (err) {
        next(err)
    }
}


const updateStudent = async (req, res, next) => {
    const id = validateIdParams(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid student ID!" })
    };

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
    const id = validateIdParams(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Invalid ID!" })
    };

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