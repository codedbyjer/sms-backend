const prisma = require('../config/prisma');

const createStudent = async (data) => {
    const existing = await prisma.student.findUnique({
        where: { email: data.email }
    });
    if (existing) throw new Error("Student email already exist!");

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
    return await prisma.student.findUnique({
        where: { studentId: Number(id) }
    })
};


const updateStudentById = async (id, data) => {
    const existing = await fetchStudentById(id);

    if (!existing) return null;

    if (data.email) {
        const emailExist = await prisma.student.findFirst({
            where: { email: data.email }
        });

        if (emailExist && emailExist.studentId !== Number(id)) {
            throw new Error("Student email already exist!");
        }
    }

    return await prisma.student.update({
        where: { studentId: Number(id) },
        data,
    })

};

const deleteStudentById = async (id) => {
    const existing = await fetchStudentById(id);

    if (!existing) return null;

    return await prisma.student.delete({
        where: { studentId: Number(id) }
    })
};


module.exports = {
    createStudent,
    fetchAllStudent,
    fetchStudentById,
    updateStudentById,
    deleteStudentById
};
