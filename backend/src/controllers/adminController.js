// Admin Controller - Secure Management, Provider Approvals, Complaints, Analytics
import { dbStore } from '../config/db.js';

export function getAdminStats(req, res) {
  try {
    const users = dbStore.getUsers();
    const providers = dbStore.getProviders();
    const bookings = dbStore.getBookings();
    const complaints = dbStore.getComplaints();

    const customersCount = users.filter(u => u.role === 'customer').length;
    const approvedProviders = providers.filter(p => p.approvalStatus === 'approved').length;
    const pendingProviders = providers.filter(p => p.approvalStatus === 'pending').length;
    const suspendedProviders = providers.filter(p => p.approvalStatus === 'suspended').length;

    const completedBookings = bookings.filter(b => b.status === 'completed');
    const activeBookings = bookings.filter(b => ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status));
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    const totalGrossRevenue = completedBookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
    const totalPlatformCommission = completedBookings.reduce((sum, b) => sum + (b.pricing?.platformFee || 0), 0);

    const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'under_investigation').length;

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: users.length,
          customers: customersCount,
          providers: providers.length
        },
        providers: {
          approved: approvedProviders,
          pending: pendingProviders,
          suspended: suspendedProviders
        },
        bookings: {
          total: bookings.length,
          active: activeBookings.length,
          completed: completedBookings.length,
          cancelled: cancelledBookings.length
        },
        financials: {
          grossRevenueBDT: totalGrossRevenue,
          platformCommissionBDT: totalPlatformCommission,
          currency: "BDT"
        },
        complaints: {
          total: complaints.length,
          open: openComplaints
        }
      }
    });
  } catch (error) {
    console.error('Error computing admin statistics:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin statistics.' });
  }
}

export function getAllProviders(req, res) {
  try {
    const { status } = req.query;
    let providers = dbStore.getProviders();

    if (status && status !== 'all') {
      providers = providers.filter(p => p.approvalStatus === status);
    }

    return res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching admin providers:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve providers.' });
  }
}

export function updateProviderApproval(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status value.' });
    }

    const provider = dbStore.getProviderById(id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found.' });
    }

    const prevStatus = provider.approvalStatus;
    provider.approvalStatus = status;

    if (status === 'approved') {
      provider.isAvailable = true;
      if (provider.verificationDoc) {
        provider.verificationDoc.status = 'verified';
        provider.verificationDoc.verifiedAt = new Date().toISOString();
      }
    } else {
      provider.isAvailable = false;
    }

    dbStore.addAuditLog({
      action: `PROVIDER_${status.toUpperCase()}`,
      performedBy: req.user.email,
      targetId: provider.id,
      details: `Provider status changed from ${prevStatus} to ${status}. Notes: ${adminNotes || 'None'}`
    });

    // Notify provider
    dbStore.addNotification({
      userId: provider.userId,
      title: `Account Status: ${status.toUpperCase()}`,
      titleBn: `অ্যাকাউন্ট স্ট্যাটাস: ${status}`,
      message: status === 'approved' 
        ? 'Congratulations! Your Shebora provider account has been verified and approved.' 
        : `Your provider account status has been updated to ${status}.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Provider status updated to ${status}.`,
      data: provider
    });
  } catch (error) {
    console.error('Error updating provider approval:', error);
    return res.status(500).json({ success: false, message: 'Failed to update approval status.' });
  }
}

export function getAllUsers(req, res) {
  try {
    const users = dbStore.getUsers().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      address: u.address,
      createdAt: u.createdAt
    }));

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
}

export function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'provider', 'customer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const user = dbStore.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const prevRole = user.role;
    user.role = role;

    dbStore.addAuditLog({
      action: "USER_ROLE_CHANGED",
      performedBy: req.user.email,
      targetId: id,
      details: `Changed role of ${user.email} from ${prevRole} to ${role}`
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ success: false, message: 'Failed to update role.' });
  }
}

export function getAllComplaints(req, res) {
  try {
    const complaints = dbStore.getComplaints();
    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Error retrieving complaints:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve complaints.' });
  }
}

export function resolveComplaint(req, res) {
  try {
    const { id } = req.params;
    const { status, adminResolution } = req.body;

    const complaint = dbStore.getComplaints().find(c => c.id === id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (status) complaint.status = status;
    if (adminResolution) complaint.adminResolution = adminResolution;
    complaint.resolvedAt = new Date().toISOString();

    dbStore.addAuditLog({
      action: "COMPLAINT_RESOLVED",
      performedBy: req.user.email,
      targetId: id,
      details: `Complaint ${id} resolved with status: ${status}. Resolution: ${adminResolution}`
    });

    // Notify customer
    dbStore.addNotification({
      userId: complaint.customerId,
      title: "Complaint Update",
      titleBn: "অভিযোগ আপডেট",
      message: `Your complaint for booking ${complaint.bookingNumber} has been reviewed: ${adminResolution}`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Complaint resolved successfully.',
      data: complaint
    });
  } catch (error) {
    console.error('Error resolving complaint:', error);
    return res.status(500).json({ success: false, message: 'Failed to resolve complaint.' });
  }
}

export function getAuditLogs(req, res) {
  try {
    const logs = dbStore.getAuditLogs();
    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs.' });
  }
}
