const prisma = require('../config/prisma');

// create new student
const createStudent = async (data) => {
    const existing = await prisma.student.findUnique({
        where: { email: data.email }
    });
    if (existing) throw new Error("Student email already exist!");

    return await prisma.student.create({ data });
}


// fetch all students
const fetchAllStudent = async () => {
    return await prisma.student.findMany();
};


// fetch specific student
const fetchStudentById = async (id) => {
    return await prisma.student.findUnique({
        where: { studentId: Number(id) }
    })
};

// update specfic student
const updateStudentById = async (id, data) => {
    const existing = await fetchStudentById(id);

    if (!existing) return null;

    return await prisma.student.update({
        where: { studentId: Number(id) },
        data,
    })

};


// delete specific student
const deleteStudentById = async (id) => {
    const existing = await fetchStudentById(id);

    if (!existing) return null;

    return await prisma.student.delete({
        where: { studentId: Number(id) }
    })
}


module.exports = {
    createStudent,
    fetchAllStudent,
    fetchStudentById,
    updateStudentById,
    deleteStudentById
};
