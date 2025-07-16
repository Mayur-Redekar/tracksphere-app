import User from '../models/User.js';
import Certification from '../models/Certification.js';

export const getAdminStats = async (req, res) => {
  try {
    const allUsers = await User.find({ role: { $ne: 'admin' } });

    const allCerts = await Certification.find({}).populate('user', 'username');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthCerts = allCerts.filter(cert => {
      const d = new Date(cert.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const bronzeCertified = thisMonthCerts.filter(c => c.status?.toLowerCase().includes('bronze')).length;
    const ncRaised = thisMonthCerts.filter(c => c.status?.toLowerCase().includes('nc')).length;
    const rejectedCerts = thisMonthCerts.filter(c => {
      const lower = c.status?.toLowerCase();
      return lower === 'reject' || lower === 'rejected';
    }).length;

    const monthlyCount = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      certifications: allCerts.filter(c => new Date(c.date).getMonth() === i).length,
    }));

    const pieChart = {
      completed: bronzeCertified,
      pending: thisMonthCerts.filter(c => c.status?.toLowerCase() === 'not certified').length,
      rejected: rejectedCerts,
    };

    // Group by username this month
    const grouped = {};
    thisMonthCerts.forEach(cert => {
      const username = cert.user?.username?.trim(); // make sure it's defined
      if (!username) return;

      if (!grouped[username]) grouped[username] = { bc: 0, nc: 0, rc: 0 };

      const status = cert.status?.toLowerCase();
      if (status?.includes('bronze')) grouped[username].bc++;
      else if (status?.includes('nc')) grouped[username].nc++;
      else if (status === 'reject' || status === 'rejected') grouped[username].rc++;
    });

    // Final overview list using all users
    const userCertOverview = allUsers.map(user => {
      const username = user.username?.trim();
      return {
        name: username,
        bc: grouped[username]?.bc || 0,
        nc: grouped[username]?.nc || 0,
        rc: grouped[username]?.rc || 0,
      };
    });

    const activeThisMonth = thisMonthCerts.reduce((acc, cert) => {
      const username = cert.user?.username?.trim();
      if (!username) return acc;
      acc[username] = (acc[username] || 0) + 1;
      return acc;
    }, {});

    const topUsers = Object.entries(activeThisMonth)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], i) => ({
        name,
        certifications: count,
        avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
      }));

    res.status(200).json({
      cards: {
        totalUsers: allUsers.length,
        totalCertifications: allCerts.length,
        bronzeCertified,
        ncRaised,
        rejectedCertifications: rejectedCerts,
        thisMonth: thisMonthCerts.length,
      },
      pieChart,
      lineChart: monthlyCount,
      userCertOverview,
      topUsers,
    });
  } catch (err) {
    console.error('Error in getAdminStats:', err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};



