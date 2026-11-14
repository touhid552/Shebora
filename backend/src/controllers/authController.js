
import bcrypt from 'bcryptjs';
import { dbStore } from '../config/db.js';
import { signToken } from '../middleware/auth.js';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

function isValidUploadedImage(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(IMAGE_DATA_URL);
  if (!match) return false;
  return Buffer.from(match[2], 'base64').length <= MAX_IMAGE_BYTES;
}

// Register Customer or Provider
export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role = 'customer',
      phone,
      address,
      categories,
      experienceYears,
      avatar,
      nidImage
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = dbStore.getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const safeRole = ['customer', 'provider'].includes(role)
      ? role
      : 'customer';

    if (avatar && !isValidUploadedImage(avatar)) {
      return res.status(400).json({ success: false, message: 'Profile picture must be a JPG, PNG, or WebP image no larger than 4 MB.' });
    }
    if (safeRole === 'provider' && !isValidUploadedImage(nidImage)) {
      return res.status(400).json({ success: false, message: 'A JPG, PNG, or WebP NID image no larger than 4 MB is required for provider registration.' });
    }

    const userId = 'usr-' + Date.now();

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: safeRole,
      phone: phone || '',
      avatar: avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=200`,
      address: address || {
        area: 'Dhanmondi',
        road: '',
        building: '',
        lat: 23.7461,
        lng: 90.3742
      },
      createdAt: new Date().toISOString()
    };

    dbStore.addUser(newUser);

    if (safeRole === 'provider') {
      const providerId = 'prv-' + Date.now();

      const newProvider = {
        id: providerId,
        userId,
        name: name.trim(),
        nameBn: name.trim(),
        phone: phone || '',
        email: normalizedEmail,
        photo: newUser.avatar,
        categories:
          Array.isArray(categories) && categories.length > 0
            ? categories
            : ['Home Cleaning'],
        experienceYears: Number(experienceYears) || 1,
        rating: 0,
        reviewsCount: 0,
        approvalStatus: 'pending',
        serviceRadiusKm: 10,
        location: {
          address:
            (address?.building ? address.building + ', ' : '') +
            (address?.area || 'Dhaka'),
          area: address?.area || 'Dhanmondi',
          lat: address?.lat || 23.7461,
          lng: address?.lng || 90.3742
        },
        verificationDoc: {
          type: 'National ID (NID)',
          image: nidImage,
          status: 'under_review',
          submittedAt: new Date().toISOString()
        },
        workingHours: '09:00 AM - 08:00 PM',
        isAvailable: false,
        totalEarnings: 0,
        completedJobs: 0
      };

      dbStore.addProvider(newProvider);

      dbStore.addAuditLog({
        action: 'PROVIDER_REGISTERED',
        performedBy: normalizedEmail,
        targetId: providerId,
        details: `New provider registered (${name}), approval status is pending review.`
      });
    }

    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      message:
        safeRole === 'provider'
          ? 'Provider account created successfully. Your profile is submitted for admin approval.'
          : 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
}

// Secure Login for Customer, Provider, and Admin
export async function login(req, res) {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const allowedRoles = ['customer', 'provider', 'admin'];

    if (expectedRole && !allowedRoles.includes(expectedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid login role.'
      });
    }

    const user = dbStore.getUserByEmail(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: 'This account does not belong to the selected login portal.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = signToken(user);

    const providerProfile =
      user.role === 'provider'
        ? dbStore.getProviderByUserId(user.id)
        : null;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        providerProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
}

// Demo Login
export async function demoLogin(req, res) {
  try {
    const { role } = req.params;
    let user;

    if (role === 'admin') {
      user = dbStore.getUserByEmail('admin@shebora.bd');
    } else if (role === 'provider') {
      user = dbStore.getUserByEmail('provider@shebora.bd');
    } else {
      user = dbStore.getUserByEmail('customer@shebora.bd');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Demo account not found.'
      });
    }

    const token = signToken(user);

    const providerProfile =
      user.role === 'provider'
        ? dbStore.getProviderByUserId(user.id)
        : null;

    return res.status(200).json({
      success: true,
      message: `Switched to ${user.name} (${user.role}).`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        providerProfile
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
}

// Get Current User
export function getCurrentUser(req, res) {
  const user = dbStore.getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }

  const providerProfile =
    user.role === 'provider'
      ? dbStore.getProviderByUserId(user.id)
      : null;

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      providerProfile
    }
  });
}

// Update User Profile
export function updateProfile(req, res) {
  const user = dbStore.getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }

  const { name, phone, address, avatar } = req.body;

  if (avatar && !isValidUploadedImage(avatar)) {
    return res.status(400).json({ success: false, message: 'Profile picture must be a JPG, PNG, or WebP image no larger than 4 MB.' });
  }

  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (avatar) user.avatar = avatar;

  if (address) {
    user.address = {
      ...user.address,
      ...address
    };
  }

  if (user.role === 'provider') {
    const provider = dbStore.getProviderByUserId(user.id);

    if (provider) {
      if (name) {
        provider.name = name;
        provider.nameBn = name;
      }

      if (phone) provider.phone = phone;
      if (avatar) provider.photo = avatar;
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar
    }
  });
}
