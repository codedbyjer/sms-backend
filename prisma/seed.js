const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const morgan = require('morgan');

const prisma = new PrismaClient();

const generatePhilMobileNo = () => {
    const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `09${randomDigits}`;
}

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

    const prefixes = ['MR', 'MS', 'DR', 'OTHER'];

    let createdStudent = 0

    for (createdStudent; createdStudent < 50; createdStudent++) {
        const selectedPrefix = faker.helpers.arrayElement(prefixes)
        await prisma.student.create({
            data: {
                prefix: selectedPrefix,
                customPrefix: selectedPrefix === 'OTHER' ? faker.person.prefix() : null,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                mobile: generatePhilMobileNo(),
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
