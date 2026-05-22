const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({
      where: { role: 'ETUDIANT' }
    });

    const totalResponsables = await prisma.user.count({
      where: { role: 'RESPONSABLE' }
    });

    const activePosts = await prisma.post.count({
      where: { status: 'APPROVED' }
    });

    const pendingPosts = await prisma.post.count({
      where: { status: 'PENDING' }
    });

    const activePolls = await prisma.poll.count({
      where: { status: 'ACTIVE' }
    });

    const unreadMessages = await prisma.message.count({
      where: { readAt: null }
    });

    const recentActivity = await prisma.post.findMany({
      take: 10,
      where: { status: 'APPROVED' },
      include: {
        author: { select: { id: true, nom: true, prenom: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      totalStudents,
      totalResponsables,
      activePosts,
      pendingPosts,
      activePolls,
      unreadMessages,
      recentActivity
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        _count: { select: { users: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, year } = req.body;

    if (!name || !year) {
      return res.status(400).json({ message: 'Name and year are required' });
    }

    const newClass = await prisma.class.create({
      data: { name, year },
      include: {
        _count: { select: { users: true } }
      }
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: { name, year },
      include: {
        _count: { select: { users: true } }
      }
    });

    res.json(updatedClass);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.class.delete({
      where: { id }
    });

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass
};
