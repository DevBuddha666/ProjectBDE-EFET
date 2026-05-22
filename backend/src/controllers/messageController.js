const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { receiverId: userId },
          { senderId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, nom: true, prenom: true, role: true } },
        receiver: { select: { id: true, nom: true, prenom: true, role: true } },
        class: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMessageThread = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      },
      include: {
        sender: { select: { id: true, nom: true, prenom: true, role: true } },
        receiver: { select: { id: true, nom: true, prenom: true, role: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    await prisma.message.updateMany({
      where: {
        receiverId: currentUserId,
        senderId: userId,
        readAt: null
      },
      data: { readAt: new Date() }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get message thread error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, classId } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        classId: classId || null
      },
      include: {
        sender: { select: { id: true, nom: true, prenom: true, role: true } },
        receiver: { select: { id: true, nom: true, prenom: true, role: true } },
        class: true
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.update({
      where: { id },
      data: { readAt: new Date() },
      include: {
        sender: { select: { id: true, nom: true, prenom: true, role: true } },
        receiver: { select: { id: true, nom: true, prenom: true, role: true } }
      }
    });

    res.json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getMessages,
  getMessageThread,
  sendMessage,
  markAsRead
};
