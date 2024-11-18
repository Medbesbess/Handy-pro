const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig");

const Joi = require("joi");

const prisma = new PrismaClient();

const validateProviderRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(50).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(10).max(255).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
    certification: Joi.string().optional(),
    identityCard: Joi.string().optional(),
    city: Joi.string()
      .valid(
        "TUNIS",
        "SFAX",
        "SOUSSE",
        "KAIROUAN",
        "BIZERTE",
        "GABES",
        "ARIANA",
        "GAFSA",
        "MONASTIR",
        "BEN_AROUS",
        "KASSERINE",
        "MEDENINE",
        "NABEUL",
        "TATAOUINE",
        "BEJA",
        "JENDOUBA",
        "MAHDIA",
        "SILIANA",
        "KEF",
        "TOZEUR",
        "MANOUBA",
        "ZAGHOUAN",
        "KEBILI"
      )
      .required(),
    phoneNumber: Joi.string().max(15).required(),
    photoUrl: Joi.string().max(1024).optional(),
    birthDate: Joi.date().iso().required(),
  });
  return schema.validate(data);
};

const validateProviderLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

const createNewServiceProvider = async (req, res) => {
  try {
    const { error } = validateProviderRegistration(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      username,
      email,
      password,
      certification,
      identityCard,
      city,
      phoneNumber,
      photoUrl,
      birthDate,
    } = req.body;

    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { email },
    });

    if (existingProvider) {
      return res.status(400).send("Email already in use");
    }

    // Upload certification to Cloudinary
    let certificationUrl = "";
    if (certification) {
      const certificationResult = await cloudinary.uploader.upload(
        certification,
        {
          folder: "certifications",
          upload_preset: "ml_default",
        }
      );
      certificationUrl = certificationResult.secure_url;
    }

    // Upload identity card to Cloudinary
    let identityCardUrl = "";
    if (identityCard) {
      const identityCardResult = await cloudinary.uploader.upload(
        identityCard,
        {
          folder: "identity-cards",
          upload_preset: "ml_default",
        }
      );
      identityCardUrl = identityCardResult.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = await prisma.serviceProvider.create({
      data: {
        username,
        email,
        password: hashedPassword,
        certification: certificationUrl,
        identityCard: identityCardUrl,
        city,
        phoneNumber,
        photoUrl: photoUrl || null,
        birthDate: new Date(birthDate),
        isAvailable: true,
        rating: 0.0,
      },
    });

    const token = jwt.sign(
      {
        id: newProvider.id,
        email: newProvider.email,
        type: "SERVICE_PROVIDER",
        isAvailable: false,
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7h" }
    );

    const providerResponse = {
      ...newProvider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(201).send({
      provider: providerResponse,
      token,
    });
  } catch (err) {
    console.error("Error creating service provider:", err);
    res.status(500).send("Server error");
  }
};

const loginServiceProvider = async (req, res) => {
  try {
    const { error } = validateProviderLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    const provider = await prisma.serviceProvider.findUnique({
      where: { email },
    });

    if (!provider) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, provider.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: provider.id,
        email: provider.email,
        type: "SERVICE_PROVIDER",
        isAvailable: provider.isAvailable,
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7h" }
    );

    const providerResponse = {
      ...provider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).json({
      user: "provider",
      provider: providerResponse,
      token,
    });
  } catch (err) {
    console.error("Error logging in service provider:", err);
    res.status(500).send("Server error");
  }
};

const updateServiceProvider = async (req, res) => {
  try {
    const { id } = req.provider;
    const updateData = {};

    const allowedUpdates = [
      "username",
      "city",
      "phoneNumber",
      "photoUrl",
      "birthDate",
      "isAvailable",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "birthDate") {
          updateData[field] = new Date(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id },
      data: updateData,
    });

    const providerResponse = {
      ...updatedProvider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).json(providerResponse);
  } catch (error) {
    console.error("Error updating service provider:", error);
    res.status(500).send("Server error");
  }
};

const getProviderProfile = async (req, res) => {
  try {
    const { id } = req.provider;

    const provider = await prisma.serviceProvider.findUnique({
      where: { id },
      include: {
        services: true,
        reviews: true,
        bookings: true,
        schedule: true,
      },
    });

    if (!provider) {
      return res.status(404).send("Provider not found");
    }

    const providerResponse = {
      ...provider,
      password: undefined,
      certification: undefined,
      identityCard: undefined,
    };

    res.status(200).json(providerResponse);
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    res.status(500).send("Server error");
  }
};

const getProviderServices = async (req, res) => {
  try {
    const { id } = req.provider;

    const services = await prisma.service.findMany({
      where: { providerId: id },
      include: {
        category: true,
      },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching provider services:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createNewServiceProvider,
  loginServiceProvider,
  updateServiceProvider,
  getProviderProfile,
  getProviderServices,
};
