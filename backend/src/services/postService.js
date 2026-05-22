const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPostStats = async () => {
  const total = await prisma.post.count();
  const approved = await prisma.post.count({ where: { status: 'APPROVED' } });
  const pending = await prisma.post.count({ where: { status: 'PENDING' } });
  const rejected = await prisma.post.count({ where: { status: 'REJECTED' } });

  return { total, approved, pending, rejected };
};

const getUserPosts = async (userId) => {
  return await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      author: { select: { id: true, nom: true, prenom: true } },
      class: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = {
  getPostStats,
  getUserPosts
};
