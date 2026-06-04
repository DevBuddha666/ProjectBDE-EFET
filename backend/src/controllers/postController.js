const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'APPROVED' },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        reactions: true,
        comments: {
          include: { user: { select: { id: true, nom: true, prenom: true } } },
          orderBy: { createdAt: 'desc' }
        },
        class: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPendingPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PENDING' },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        class: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get pending posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const authorId = req.user.id;
    const posts = await prisma.post.findMany({
      where: { authorId },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        reactions: true,
        comments: {
          include: { user: { select: { id: true, nom: true, prenom: true } } },
          orderBy: { createdAt: 'desc' }
        },
        class: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        reactions: true,
        comments: {
          include: { user: { select: { id: true, nom: true, prenom: true } } },
          orderBy: { createdAt: 'desc' }
        },
        class: true
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, imageUrl, classId } = req.body;
    const authorId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        authorId,
        classId: classId || null,
        status: 'PENDING'
      },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        class: true
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const approvePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: {
        status: 'APPROVED',
        feedback: feedback || null
      },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        class: true
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Approve post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const rejectPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: 'Feedback is required for rejection' });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        status: 'REJECTED',
        feedback
      },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } },
        class: true
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Reject post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const reactToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    if (!type || !['LIKE', 'HEART', 'CLAP'].includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId,
          postId: id,
          type
        }
      }
    });

    if (existingReaction) {
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      });
      return res.json({ message: 'Reaction removed' });
    }

    const reaction = await prisma.reaction.create({
      data: {
        userId,
        postId: id,
        type
      }
    });

    res.status(201).json(reaction);
  } catch (error) {
    console.error('React to post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId: id
      },
      include: {
        user: { select: { id: true, nom: true, prenom: true } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllPosts,
  getPendingPosts,
  getMyPosts,
  getPostById,
  createPost,
  approvePost,
  rejectPost,
  deletePost,
  reactToPost,
  addComment
};
