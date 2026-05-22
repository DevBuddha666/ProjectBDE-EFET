const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserVote = async (pollId, userId) => {
  return await prisma.vote.findUnique({
    where: {
      pollId_voterId: {
        pollId,
        voterId: userId
      }
    }
  });
};

const getPollStats = async () => {
  const total = await prisma.poll.count();
  const active = await prisma.poll.count({ where: { status: 'ACTIVE' } });
  const closed = await prisma.poll.count({ where: { status: 'CLOSED' } });

  return { total, active, closed };
};

module.exports = {
  getUserVote,
  getPollStats
};
