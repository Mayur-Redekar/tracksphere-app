import Certification from '../models/Certification.js';

export const addCertification = async (req, res) => {
  try {
    const cert = new Certification({
      user: req.user.id,
      unitName: req.body.unitName,
      zedmsme: req.body.zedmsme,
      password: req.body.password,
      date: req.body.date,
      status: 'not certified',
    });
    await cert.save();
    res.status(201).json({ msg: 'Certification added.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
};

export const getMyCertifications = async (req, res) => {
  try {
    const certs = await Certification.find({ user: req.user.id }).sort({ date: -1 });
    res.json(certs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
};

export const updateCertificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ msg: 'Status is required.' });

    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.status(404).json({ msg: 'Certification not found.' });

    cert.status = status;
    await cert.save();

    res.status(200).json({ msg: 'Status updated', certification: cert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getTodayCertifications = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Certification.countDocuments({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
};

// all users for admin
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certification.find()
      .populate('user', 'username email') // only username & email
      .sort({ createdAt: -1 });

    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

