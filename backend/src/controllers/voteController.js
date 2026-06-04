const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPolls = async (req, res) => {
  try {
    const { classId } = req.query;
    const userFiliere = req.user?.filiere;
    
    let where = classId ? { classId } : {};
    
    // Filter polls by user's filiere (if filiere is set on poll)
    if (userFiliere) {
      where = {
        ...where,
        OR: [
          { filiere: userFiliere },
          { filiere: null } // Show polls without filiere to everyone
        ]
      };
    }

    const polls = await prisma.poll.findMany({
      where,
      include: {
        class: true,
        options: {
          include: {
            candidate: { select: { id: true, nom: true, prenom: true } },
            votes: { select: { voterId: true } },
            _count: { select: { votes: true } }
          }
        },
        _count: { select: { votes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(polls);
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        class: true,
        options: {
          include: {
            candidate: { select: { id: true, nom: true, prenom: true } },
            votes: { select: { voterId: true } },
            _count: { select: { votes: true } }
          }
        },
        _count: { select: { votes: true } }
      }
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createPoll = async (req, res) => {
  try {
    const { title, description, candidateIds, deadline, filiere } = req.body;

    console.log('===== CREATE POLL REQUEST =====');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('title:', title, '| type:', typeof title);
    console.log('candidateIds:', candidateIds, '| type:', typeof candidateIds, '| length:', candidateIds?.length);
    console.log('deadline:', deadline, '| type:', typeof deadline);
    console.log('filiere:', filiere, '| type:', typeof filiere);
    console.log('description:', description, '| type:', typeof description);

    if (!title) {
      console.error('❌ FAILED: Missing title');
      return res.status(400).json({ message: 'Missing required field: title' });
    }
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      console.error('❌ FAILED: Missing or invalid candidateIds', { candidateIds, isArray: Array.isArray(candidateIds), length: candidateIds?.length });
      return res.status(400).json({ message: 'Missing required field: candidateIds (must be non-empty array)' });
    }
    if (!deadline) {
      console.error('❌ FAILED: Missing deadline');
      return res.status(400).json({ message: 'Missing required field: deadline' });
    }

    console.log('✅ Validation passed, creating poll...');

    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        filiere: filiere || null,
        deadline: new Date(deadline),
        options: {
          create: candidateIds.map(candidateId => ({
            candidateId
          }))
        }
      },
      include: {
        class: true,
        options: {
          include: {
            candidate: { select: { id: true, nom: true, prenom: true } }
          }
        }
      }
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error('❌ CREATE POLL ERROR:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const closePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await prisma.poll.update({
      where: { id },
      data: { status: 'CLOSED' },
      include: {
        class: true,
        options: {
          include: {
            candidate: { select: { id: true, nom: true, prenom: true } },
            _count: { select: { votes: true } }
          }
        }
      }
    });

    res.json(poll);
  } catch (error) {
    console.error('Close poll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const vote = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIds } = req.body;
    const voterId = req.user.id;
    const userFiliere = req.user.filiere;

    if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      return res.status(400).json({ message: 'Option IDs array is required' });
    }

    const poll = await prisma.poll.findUnique({
      where: { id }
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if poll is for specific filiere
    if (poll.filiere && poll.filiere !== userFiliere) {
      return res.status(403).json({ message: 'You do not have permission to vote in this poll' });
    }

    if (poll.status === 'CLOSED') {
      return res.status(400).json({ message: 'Poll is closed' });
    }

    if (new Date() > new Date(poll.deadline)) {
      return res.status(400).json({ message: 'Poll deadline has passed' });
    }

    // Check if user has already voted for any option in this poll
    const existingVotes = await prisma.vote.findMany({
      where: {
        pollId: id,
        voterId
      }
    });

    if (existingVotes.length > 0) {
      return res.status(400).json({ message: 'You have already voted in this poll' });
    }

    // Create multiple votes for all selected options
    const votes = await Promise.all(
      optionIds.map(optionId =>
        prisma.vote.create({
          data: {
            pollId: id,
            optionId,
            voterId
          }
        })
      )
    );

    res.status(201).json({ 
      message: `Successfully voted for ${votes.length} candidate(s)`,
      votes 
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPollResults = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        class: true,
        options: {
          include: {
            candidate: { select: { id: true, nom: true, prenom: true } },
            votes: {
              include: { voter: { select: { id: true, nom: true, prenom: true } } }
            },
            _count: { select: { votes: true } }
          }
        },
        _count: { select: { votes: true } }
      }
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const totalVotes = poll._count.votes;
    const results = poll.options.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0
    }));

    res.json({ poll, results, totalVotes });
  } catch (error) {
    console.error('Get poll results error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const announceWinner = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            candidate: true,
            _count: { select: { votes: true } }
          }
        }
      }
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const winnerOption = poll.options.reduce((max, option) =>
      option._count.votes > max._count.votes ? option : max
    );

    await prisma.user.update({
      where: { id: winnerOption.candidateId },
      data: { role: 'RESPONSABLE' }
    });

    await prisma.poll.update({
      where: { id },
      data: { status: 'CLOSED' }
    });

    res.json({
      message: 'Winner announced successfully',
      winner: winnerOption.candidate,
      votes: winnerOption._count.votes
    });
  } catch (error) {
    console.error('Announce winner error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id }
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    await prisma.poll.delete({
      where: { id }
    });

    res.json({ message: 'Poll deleted successfully', id });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPolls,
  getPollById,
  createPoll,
  closePoll,
  vote,
  getPollResults,
  announceWinner,
  deletePoll
};
