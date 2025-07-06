import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  unitName: String,
  zedmsme: String,
  password: String,
  date: Date,
  status: { type: String, default: 'not certified' },
}, { timestamps: true });

export default mongoose.model('Certification', CertificationSchema);
