import {
  changePassword,
  getUserById,
  loginUser,
  registerUser,
  updateProfile,
} from '../services/authService.js';
import { getSiteContent } from '../services/siteContentService.js';

export async function register(req, res) {
  try {
    const content = await getSiteContent();
    const maintenanceMode = content?.systemSettings?.maintenanceMode ?? false;
    if (maintenanceMode) {
      return res.status(503).json({
        ok: false,
        message:
          content?.systemSettings?.maintenanceMessage ||
          'Service is temporarily unavailable due to maintenance.',
      });
    }
    const allowUserRegistration = content?.systemSettings?.allowUserRegistration ?? true;
    if (!allowUserRegistration) {
      return res.status(403).json({
        ok: false,
        message: 'New registration is currently disabled by admin.',
      });
    }

    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Name, email and password are required.',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const result = await registerUser({ name, email, password });
    return res.status(201).json({
      ok: true,
      message: 'Registration successful.',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Registration failed.',
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email and password are required.',
      });
    }

    const result = await loginUser({ email, password });
    return res.status(200).json({
      ok: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: error.message || 'Login failed.',
    });
  }
}

export async function me(req, res) {
  try {
    const user = await getUserById(req.auth.userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unable to fetch user profile.',
      error: error.message,
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const { name, email, avatarUrl, avatarDataUrl } = req.body ?? {};
    const updatedUser = await updateProfile(req.auth.userId, {
      name,
      email,
      avatarUrl,
      avatarDataUrl,
    });
    return res.status(200).json({
      ok: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to update profile.',
    });
  }
}

export async function updateMyPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Current password and new password are required.',
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    await changePassword(req.auth.userId, { currentPassword, newPassword });
    return res.status(200).json({
      ok: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Unable to change password.',
    });
  }
}

