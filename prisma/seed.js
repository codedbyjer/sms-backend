const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function runSeeder() {
    if (process.env.NODE_ENV === 'production') {
        console.log('Skipping seed in production environment');
        return;
    }

    console.log('Starting database seeding...')

    const adminPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
        data: {
            email: 'admin@gmail.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User'
        }
    });

    console.log('Created admin user (admin@gmail.com / admin123');

    const prefixes = ['Mr.', 'Ms.', 'Dr.'];

    let createdStudent = 0

    for (createdStudent; createdStudent < 50; createdStudent++) {
        await prisma.student.create({
            data: {
                prefix: faker.helpers.arrayElement(prefixes),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                mobile: faker.phone.number('09#########'),
                email: faker.internet.email().toLowerCase()
            }
        });
    }


    console.log(`Created ${createdStudent} with random data`);
    console.log('Seeding completed!');
}

runSeeder()
    .catch((e) => {
        console.error('Error seeding database: ', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
