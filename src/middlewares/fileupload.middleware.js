// 1. Import multer.
import multer from 'multer';
import fs from 'fs';

// 2. Configure storage with filename and location.
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');  
    const safeFilename = timestamp + '-' + file.originalname;
    console.log('Saving file:', safeFilename);  // Debugging log
    cb(null, safeFilename);
  },
  // filename: (req, file, cb) => {
  //   cb(
  //     null,
  //     new Date().toISOString() + file.originalname
  //   );
  // },
});

export const upload = multer({
  storage: storage,
});
