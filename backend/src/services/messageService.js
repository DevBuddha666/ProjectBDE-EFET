const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUnreadCount = async (userId) => {
  return await prisma.message.count({
    where: {
      receiverId: userId,
      readAt: null
    }
  });
};

const getConversations = async (userId) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    include: {
      sender: { select: { id: true, nom: true, prenom: true } },
      receiver: { select: { id: true, nom: true, prenom: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const conversations = {};
  messages.forEach(msg => {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!conversations[otherUserId]) {
      conversations[otherUserId] = {
        user: msg.senderId === userId ? msg.receiver : msg.sender,
        lastMessage: msg,
        unreadCount: 0
      };
    }
  });

  return Object.values(conversations);
};

module.exports = {
  getUnreadCount,
  getConversations
};
