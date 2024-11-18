// controllers/getProviderProfile.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProviderProfile = async (req, res) => {
  const providerId  = req.provider.id;


  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: Number(providerId) },
    });

    if (!provider) {
      return res.status(404).send("Provider not found");
    }

    // Remove sensitive data before sending response
    const providerResponse = {
      ...provider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).send(providerResponse);
  } catch (err) {
    console.log(err);
    
    console.error("Error retrieving provider profile:", err);
    res.status(500).send("Server error");
  }
};

const updateProviderProfile = async (req, res) => {
  const providerId = req.provider.id;
  const updates = req.body;
 
  try {
    // Basic validation
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

   
    delete updates.id; 
    
   
    if (updates.email && !isValidEmail(updates.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: Number(providerId) },
      data: updates,
    });

    // Remove sensitive data before sending response
    const providerResponse = {
      ...updatedProvider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).json({
      success: true,
      data: providerResponse,
      message: "Profile updated successfully"
    });
    
  } catch (err) {
    console.error("Error updating provider profile:", err);
    
    
    if (err.code === 'P2002') {
      return res.status(400).json({ 
        success: false,
        message: "This email is already in use" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error while updating profile" 
    });
  }
};

module.exports = {
  getProviderProfile,
  updateProviderProfile,
};
