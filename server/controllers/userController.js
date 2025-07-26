import User from '../models/User.js';
import bcrypt from 'bcrypt';
import moment from 'moment';
import Certification from '../models/Certification.js'; 
import cloudinary from '../utils/cloudinary.js';

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, email, zedId, mobile } = req.body;

    // ✅ Delete previous Cloudinary image if new one is uploaded
    if (req.file && req.file.path) {
      if (user.profilePic) {
        const publicId = user.profilePic
          .split('/')
          .slice(-1)[0]
          .split('.')[0];
        await cloudinary.uploader.destroy(`profile_pics/${publicId}`);
      }
      user.profilePic = req.file.path;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.zedId = zedId || user.zedId;
    user.mobile = mobile || user.mobile;

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
    res.json({ msg: 'Password updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Fetch the indiviual user profile 
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user); // <-- ✅ This sends the profilePic as-is (should be /uploads/filename.jpg)
  } catch (err) {
    console.error('Profile load error:', err);
    res.status(500).json({ msg: 'Failed to fetch profile' });
  }
};

// Show their own dashbaord
export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = moment().startOf('day');
    const startOfCurrentMonth = moment().startOf('month');
    const endOfCurrentMonth = moment().endOf('month');
    const startOfPreviousMonth = moment().subtract(1, 'month').startOf('month');
    const endOfPreviousMonth = moment().subtract(1, 'month').endOf('month');

    // Fetch all certifications for the user
    const allCerts = await Certification.find({ user: userId });

    // Today's Certifications
    const todayCertifications = allCerts.filter(cert =>
      moment(cert.createdAt).isSame(today, 'day')
    ).length;

    // Total Certifications
    const totalCertifications = allCerts.length;

    // Current Month Certifications
    const currentMonthCerts = allCerts.filter(cert =>
      moment(cert.createdAt).isBetween(startOfCurrentMonth, endOfCurrentMonth, undefined, '[]')
    );

    const pendingCertifications = currentMonthCerts.filter(cert => cert.status === 'not certified').length;
    const completedCertifications = currentMonthCerts.filter(cert => cert.status === 'Bronze Certified').length;
    const rejectedCertificates = currentMonthCerts.filter(cert => cert.status === 'Reject').length;

    // NC Raised (All time)
    const ncRaised = allCerts.filter(cert => cert.status === 'NC Raised').length;

    // Previous Month Certifications (all statuses)
    const previousMonthCertifications = allCerts.filter(cert =>
      moment(cert.createdAt).isBetween(startOfPreviousMonth, endOfPreviousMonth, undefined, '[]')
    ).length;

    // Monthly Trend Chart Data (last 6 months) - lineChartData
    const lineChartData = [];
    for (let i = 5; i >= 0; i--) {
      const month = moment().subtract(i, 'months');
      const count = allCerts.filter(cert =>
        moment(cert.createdAt).isSame(month, 'month')
      ).length;

      lineChartData.push({
        month: month.format('MMM'),
        certifications: count,
      });
    }

    // === New: Bar Chart Data for last 6 months, split by status ===
    const statuses = ['not certified', 'Bronze Certified', 'Reject', 'NC Raised'];

    // Initialize bar chart data array with months
    const barChartData = [];
    for (let i = 5; i >= 0; i--) {
      const month = moment().subtract(i, 'months');
      const monthStr = month.format('MMM');

      // For each status, count certifications in this month
      const monthData = { month: monthStr };
      statuses.forEach(status => {
        monthData[status === 'not certified' ? 'Not Certified' : 
                  status === 'Bronze Certified' ? 'Bronze Certified' : 
                  status === 'Reject' ? 'Reject' : 'NC Raised'] =
          allCerts.filter(cert =>
            cert.status === status &&
            moment(cert.createdAt).isSame(month, 'month')
          ).length;
      });

      barChartData.push(monthData);
    }

    // Final response
    res.json({
      todayCertifications,
      totalCertifications,
      pendingCertifications,
      completedCertifications,
      rejectedCertificates,
      ncRaised,
      currentMonth: currentMonthCerts.length,
      previousMonth: previousMonthCertifications,
      lineChartData,
      barChartData,
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ msg: 'Server error while fetching dashboard stats' });
  }
};






