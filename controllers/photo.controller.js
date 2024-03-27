const fs = require('fs');
const path = require('path');
const multer = require('multer');

const PhotoModel = require('../models/photo.model.js');

// Assuming you have an Express app defined somewhere

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Define your file filter logic here
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

exports.set = upload.single('image'), (req, res, next) => {
  // ...
};








//const upload = multer({ storage: storage });

exports.insert = upload.single('image'), (req, res, next) => {
  const { name, desc } = req.body;

  const obj = {
    img: {
      data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
      contentType: req.file.mimetype
    }
  };

  PhotoModel.create(obj)
    .then((item) => {
      console.log('Item saved successfully:', item);
      res.status(200).send('Item saved successfully');
    })
    .catch((err) => {
      console.error('Error saving item:', err);
      res.status(500).send('Internal Server Error');
    });
};

