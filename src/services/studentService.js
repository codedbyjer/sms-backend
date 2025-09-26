const prisma = require('../config/prisma');
const { normalizeStudentData } = require('../utils/normalizeStudentData')

const createStudent = async (data) => {
    data = normalizeStudentData(data);

    if (!data || Object.keys(data).length === 0) {
        const error = new Error("No data provided for student creation.");
        error.statusCode = 400;
        throw error;
    }

    const requiredFields = ['prefix', 'firstName', 'lastName', 'email', 'mobile'];
    const missingFields = requiredFields.filter(f => !data[f] || !data[f].toString().trim());
    if (missingFields.length > 0) {
        const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    if (data.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            const error = new Error("Invalid email format.");
            error.statusCode = 400;
            throw error;
        }

        const emailExist = await prisma.student.findUnique({
            where: { email: data.email }
        });
        if (emailExist) {
            const error = new Error("Email already in use by another student!");
            error.statusCode = 400;
            throw error;
        }
    }

    return await prisma.student.create({ data });
}


const fetchAllStudent = async (search, page = 1, limit = 10, sortBy = "createdAt", order = "desc") => {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum;

    let conditions = [];

    if (search) {
        const parts = search.trim().split(/\s+/)

        parts.forEach(part => {
            conditions.push(
                { firstName: { contains: part, mode: 'insensitive' } },
                { lastName: { contains: part, mode: 'insensitive' } },
                { email: { contains: part, mode: 'insensitive' } },
                { mobile: { contains: part, mode: 'insensitive' } }
            )
        })

        conditions.push(
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } }
        )
    }

    const whereCondition = search ? { OR: conditions } : {};

    const [total, students] = await prisma.$transaction([
        prisma.student.count({ where: whereCondition }),
        prisma.student.findMany({
            where: whereCondition,
            skip,
            take: limitNum,
            orderBy: {
                [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc'
            }
        })
    ])

    const totalPages = Math.ceil(total / limitNum);

    return {
        total,
        page,
        totalPages,
        limit,
        students
    }
};


const fetchStudentById = async (id) => {
    const student = await prisma.student.findUnique({
        where: { studentId: Number(id) }
    });

    if (!student) {
        const error = new Error("Student not found with the provided ID.");
        error.statusCode = 404;
        throw error;
    }

    return student;
};


const updateStudentById = async (id, data) => {
    data = normalizeStudentData(data);

    if (!data || Object.keys(data).length === 0) {
        const error = new Error("No fields provided for the update.");
        error.statusCode = 400;
        throw error;
    }

    const allowedFields = ['prefix', 'firstName', 'lastName', 'email', 'mobile'];

    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && data[key].trim() === '') {
            delete data[key];
        }
    });

    const invalidFields = Object.keys(data).filter(f => !allowedFields.includes(f));
    if (invalidFields.length > 0) {
        const error = new Error(`Invalid fields in update: ${invalidFields.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    if (data.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            const error = new Error("Invalid email format.");
            error.statusCode = 400;
            throw error;
        }

        const emailExist = await prisma.student.findFirst({
            where: {
                email: data.email,
                NOT: { studentId: Number(id) }
            },

        });
        if (emailExist) {
            const error = new Error("Email already in use by another student.");
            error.statusCode = 400;
            throw error;
        }

    }

    return await prisma.student.update({
        where: { studentId: Number(id) },
        data,
    })

};


const deleteStudentById = async (id) => {
    const student = await prisma.student.findUnique({
        where: { studentId: Number(id) }
    })

    if (!student) {
        const error = new Error("Student not found with the provided ID.");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.student.delete({
        where: ({ studentId: Number(id) })
    })
};


module.exports = {
    createStudent,
    fetchAllStudent,
    fetchStudentById,
    updateStudentById,
    deleteStudentById
};
