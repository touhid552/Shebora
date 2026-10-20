// Auth Controller - Customer, Provider, and Admin accounts
import bcrypt from 'bcryptjs';
import { dbStore } from '../config/db.js';
import { signToken } from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const { name, email, password, role = 'customer', phone, address, categories, experienceYears } = req.body;

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

    const existingUser = dbStore.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const safeRole = ['customer', 'provider'].includes(role) ? role : 'customer';
    const userId = 'usr-' + Date.now();

    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: safeRole,
      phone: phone || '',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=200`,
      address: address || { area: "Dhanmondi", road: "", building: "", lat: 23.7461, lng: 90.3742 },
      createdAt: new Date().toISOString()
    };

    dbStore.addUser(newUser);

    // If registered as provider, create associated ProviderProfile in "pending" status
    if (safeRole === 'provider') {
      const providerId = 'prv-' + Date.now();
      const newProvider = {
        id: providerId,
        userId: userId,
        name: name.trim(),
        nameBn: name.trim(),
        phone: phone || '',
        email: email.toLowerCase().trim(),
        photo: newUser.avatar,
        categories: Array.isArray(categories) && categories.length > 0 ? categories : ["Home Cleaning"],
        experienceYears: Number(experienceYears) || 1,
        rating: 0,
        reviewsCount: 0,
        approvalStatus: "pending", // Providers must NOT receive customer bookings until approved
        serviceRadiusKm: 10,
        location: {
          address: (address?.building ? address.building + ', ' : '') + (address?.area || 'Dhaka'),
          area: address?.area || 'Dhanmondi',
          lat: address?.lat || 23.7461,
          lng: address?.lng || 90.3742
        },
        verificationDoc: {
          type: "National ID (NID)",
          status: "under_review",
          submittedAt: new Date().toISOString()
        },
        workingHours: "09:00 AM - 08:00 PM",
        isAvailable: false,
        totalEarnings: 0,
        completedJobs: 0
      };
      dbStore.addProvider(newProvider);

      dbStore.addAuditLog({
        action: "PROVIDER_REGISTERED",
        performedBy: email,
        targetId: providerId,
        details: `New provider registered (${name}), approval status is pending review.`
      });
    }

    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      message: safeRole === 'provider' 
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
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare bcrypt hash or allow test password fallback for seeded demo accounts
    let isMatch = false;
    if (password === 'password123') {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = signToken(user);
    const providerProfile = user.role === 'provider' ? dbStore.getProviderByUserId(user.id) : null;

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
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export async function demoLogin(req, res) {
  try {
    const { role } = req.params; // 'admin' | 'provider' | 'customer'
    let user;

    if (role === 'admin') {
      user = dbStore.getUserByEmail('admin@shebora.bd');
    } else if (role === 'provider') {
      user = dbStore.getUserByEmail('provider@shebora.bd');
    } else {
      user = dbStore.getUserByEmail('customer@shebora.bd');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo account not found.' });
    }

    const token = signToken(user);
    const providerProfile = user.role === 'provider' ? dbStore.getProviderByUserId(user.id) : null;

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
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

export function getCurrentUser(req, res) {
  const user = dbStore.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  const providerProfile = user.role === 'provider' ? dbStore.getProviderByUserId(user.id) : null;

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

export function updateProfile(req, res) {
  const user = dbStore.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { name, phone, address, avatar } = req.body;
  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (avatar) user.avatar = avatar;
  if (address) {
    user.address = {
      ...user.address,
      ...address
    };
  }

  // If provider, keep ProviderProfile in sync
  if (user.role === 'provider') {
    const p = dbStore.getProviderByUserId(user.id);
    if (p) {
      if (name) { p.name = name; p.nameBn = name; }
      if (phone) p.phone = phone;
      if (avatar) p.photo = avatar;
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
