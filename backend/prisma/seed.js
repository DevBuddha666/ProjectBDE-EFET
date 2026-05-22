const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@efetmaroc.com' },
    update: {},
    create: {
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@efetmaroc.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Created admin user:', admin.email);

  const class1 = await prisma.class.upsert({
    where: { id: 'class-1' },
    update: {},
    create: {
      id: 'class-1',
      name: 'Marketing Digital',
      year: '2024-2025'
    }
  });
  console.log('Created class:', class1.name);

  const class2 = await prisma.class.upsert({
    where: { id: 'class-2' },
    update: {},
    create: {
      id: 'class-2',
      name: 'Gestion Commerce',
      year: '2024-2025'
    }
  });
  console.log('Created class:', class2.name);

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@efetmaroc.com' },
    update: {},
    create: {
      nom: 'Alami',
      prenom: 'Mohammed',
      email: 'student1@efetmaroc.com',
      password: hashedPassword,
      role: 'ETUDIANT',
      filiere: 'DI',
      classId: class1.id
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@efetmaroc.com' },
    update: {},
    create: {
      nom: 'Benali',
      prenom: 'Fatima',
      email: 'student2@efetmaroc.com',
      password: hashedPassword,
      role: 'ETUDIANT',
      filiere: 'CI',
      classId: class1.id
    }
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@efetmaroc.com' },
    update: {},
    create: {
      nom: 'Chraibi',
      prenom: 'Ahmed',
      email: 'student3@efetmaroc.com',
      password: hashedPassword,
      role: 'ETUDIANT',
      filiere: 'AGAC',
      classId: class1.id
    }
  });

  const student4 = await prisma.user.upsert({
    where: { email: 'student4@efetmaroc.com' },
    update: {},
    create: {
      nom: 'Drissi',
      prenom: 'Sara',
      email: 'student4@efetmaroc.com',
      password: hashedPassword,
      role: 'ETUDIANT',
      filiere: 'FC',
      classId: class2.id
    }
  });

  const student5 = await prisma.user.upsert({
    where: { email: 'student5@efetmaroc.com' },
    update: {},
    create: {
      nom: 'El Fassi',
      prenom: 'Karim',
      email: 'student5@efetmaroc.com',
      password: hashedPassword,
      role: 'ETUDIANT',
      filiere: 'DI',
      classId: class2.id
    }
  });

  const responsable = await prisma.user.upsert({
    where: { email: 'responsable@efetmaroc.com' },
    update: {},
    create: {
      nom: 'Mansouri',
      prenom: 'Leila',
      email: 'responsable@efetmaroc.com',
      password: hashedPassword,
      role: 'RESPONSABLE',
      filiere: 'DI',
      classId: class1.id
    }
  });

  console.log('Created 5 students and 1 responsable');

  const post1 = await prisma.post.create({
    data: {
      title: 'Bienvenue au BDE !',
      content: 'Nous sommes ravis de vous accueillir au Bureau des Étudiants. Cette année sera pleine d\'activités et d\'événements passionnants.',
      status: 'APPROVED',
      authorId: admin.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Événement: Journée portes ouvertes',
      content: 'Rejoignez-nous pour notre journée portes ouvertes le 15 novembre. Des ateliers, des présentations et des activités vous attendent !',
      status: 'APPROVED',
      authorId: responsable.id,
      classId: class1.id
    }
  });

  console.log('Created sample posts');

  const poll = await prisma.poll.create({
    data: {
      title: 'Élection du Responsable de Classe - Marketing Digital',
      description: 'Votez pour votre prochain responsable de classe',
      classId: class1.id,
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      options: {
        create: [
          { candidateId: student1.id },
          { candidateId: student2.id },
          { candidateId: student3.id }
        ]
      }
    }
  });

  console.log('Created sample poll');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
