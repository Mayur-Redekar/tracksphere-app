import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js'; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pics',
    resource_type: 'image',
    public_id: (req, file) => 'user_' + Date.now(),
  },
});

const upload = multer({ storage });
export default upload;


