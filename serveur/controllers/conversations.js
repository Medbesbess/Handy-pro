// conversationsController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(id),
      },
      include: {
        conversation: {
          include: {
            User: true,
            provider: true,
          },
        },
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(400).json({ 
      message: "Could not fetch messages", 
      error: error.message 
    });
  }
};

const getConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: true,
        provider: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        },
        User: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        },
      },
    });
    
    if (conversation) {
      res.status(200).json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ 
      message: "Could not fetch conversation", 
      error: error.message 
    });
  }
};

const getAllConversations = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { providerId: parseInt(userId) },
          { UserId: parseInt(userId) }
        ],
      },
      include: {
        provider: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        },
        User: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Return empty array instead of 404
    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    res.status(500).json({ 
      message: "Error fetching conversations", 
      error: error.message 
    });
  }
};


const createConversation = async (req, res) => {
  const { userId, providerId } = req.body;

  try {
    // Vérifier si la conversation existe déjà
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { UserId: parseInt(userId) },
          { providerId: parseInt(providerId) }
        ]
      },
      include: {
        provider: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        },
        User: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        }
      }
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Créer une nouvelle conversation si elle n'existe pas
    const newConversation = await prisma.conversation.create({
      data: {
        UserId: parseInt(userId),
        providerId: parseInt(providerId)
      },
      include: {
        provider: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        },
        User: {
          select: {
            id: true,
            username: true,
            photoUrl: true
          }
        }
      }
    });

    res.status(201).json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ 
      message: "Could not create conversation", 
      error: error.message 
    });
  }
};
const searchConversations = async (req, res) => {
  const { username, providerName, userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    let conversations;
    
    if (username) {
      // Recherche pour les providers (cherchant des users)
      conversations = await prisma.conversation.findMany({
        where: {
          providerId: parseInt(userId),
          User: {
            username: {
              contains: username,
              mode: 'insensitive'
            }
          }
        },
        include: {
          provider: {
            select: {
              id: true,
              username: true,
              photoUrl: true
            }
          },
          User: {
            select: {
              id: true,
              username: true,
              photoUrl: true
            }
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } else if (providerName) {
      // Recherche pour les users (cherchant des providers)
      conversations = await prisma.conversation.findMany({
        where: {
          UserId: parseInt(userId),
          provider: {
            username: {
              contains: providerName,
              mode: 'insensitive'
            }
          }
        },
        include: {
          provider: {
            select: {
              id: true,
              username: true,
              photoUrl: true
            }
          },
          User: {
            select: {
              id: true,
              username: true,
              photoUrl: true
            }
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    }

    return res.status(200).json(conversations || []);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      message: "Error searching conversations", 
      error: error.message 
    });
  }
};
const getUnreadCount = async (req, res) => {
  const { userId } = req.params;
  const role = req.query.role || 'provider';

  try {
    const unreadCount = await prisma.message.count({
      where: {
        conversation: {
          OR: [
            { providerId: parseInt(userId) },
            { UserId: parseInt(userId) }
          ],
        },
        sender: role === 'provider' ? 'user' : 'provider',
        isRead: false
      }
    });

    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ 
      message: "Error counting unread messages", 
      error: error.message 
    });
  }
};

const markMessagesAsRead = async (req, res) => {
  const { conversationId } = req.params;
  const { role } = req.query;

  try {
    await prisma.message.updateMany({
      where: {
        conversationId: parseInt(conversationId),
        sender: role === 'provider' ? 'user' : 'provider',
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ 
      message: "Error marking messages as read", 
      error: error.message 
    });
  }
};


module.exports = {
  getMessages,
  getConversation,
  getAllConversations,
  createConversation,
  searchConversations,
  getUnreadCount,
  markMessagesAsRead
};