const {
    createStudent,
    fetchAllStudent,
    fetchStudentById,
    updateStudentById,
    deleteStudentById,
} = require('../services/studentService');
const { validateIdParams } = require('../middlewares/validate');
const { successResponse } = require('../utils/response')

const addStudent = async (req, res, next) => {
    try {
        const newStudent = await createStudent(req.body);
        return successResponse(res, 201, "New Student Created Successfully!", newStudent);

    } catch (err) {
        next(err)
    }
}

const retrieveStudents = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
        const students = await fetchAllStudent(search, page, limit, sortBy, order);

        if (!search && students.total === 0) {
            const error = new Error("No students found.");
            error.statusCode = 404;
            throw error;
        }

        if (page > students.totalPages) {
            const error = new Error(`Page ${page} does not exist. There are only ${students.totalPages} pages available.`);
            error.statusCode = 404;
            throw error;
        }

        if (search && students.students.length === 0) {
            const error = new Error(`No student matches the search term: "${search}".`);
            error.statusCode = 404;
            throw error;
        }


        return successResponse(res, 200, "Students retieved successfully!", students);
    } catch (err) {
        next(err)
    }
}

const retrieveStudentById = async (req, res, next) => {
    const id = validateIdParams(req.params.id);
    if (!id) throw Object.assign(new Error("Invalid student ID!"), { statusCode: 400, error: ["ID must be a number."] });

    try {
        const student = await fetchStudentById(id);
        return successResponse(res, 200, "Student retrieved successfully!", student);
    } catch (err) {
        next(err)
    }
}


const updateStudent = async (req, res, next) => {
    const id = validateIdParams(req.params.id);
    if (!id) throw Object.assign(new Error("Invalid student ID!"), { statusCode: 400, error: ["ID must be a number."] });

    try {
        const updated = await updateStudentById(id, req.body);
        return successResponse(res, 200, `${updated.firstName}'s data updated successfully!`, updated);

    } catch (error) {
        next(error);
    }

}


const deleteStudent = async (req, res, next) => {
    const id = validateIdParams(req.params.id);
    if (!id) throw Object.assign(new Error("Invalid student ID!"), { statusCode: 400, error: ["ID must be a number."] });

    try {
        const deleted = await deleteStudentById(id);
        return successResponse(res, 200, `${deleted.firstName}'s data, deleted successfully!`, deleted)
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