const prisma = require('../config/prisma');

const createStudent = async (data) => {
    const existing = await prisma.student.findUnique({
        where: { email: data.email }
    });
    if (existing) throw new Error("Student email already exist!");

    const student = await prisma.student.create({
        data,
    })

    return student
}

const fetchAllStudent = async () => {
    return await prisma.student.findMany();
};

const fetchStudentById = async (id) => {
    return await prisma.student.findUnique({
        where: { studentId: Number(id) }
    })
};

const updateStudentById = async (id, data) => {
    const existing = await fetchStudentById(id);

    if (!existing) throw new Error("Student does not exist!");

    return await prisma.student.update({
        where: { studentId: Number(id) },
        data,
    })

};

const deleteStudentById = async (id) => {
    const student = await fetchStudentById(id);

    if (!student) throw new Error("Student does not exist!");

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
