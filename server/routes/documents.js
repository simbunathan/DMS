const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('document'), docController.uploadDocument);
router.get('/', auth, docController.getDocuments);
router.delete('/:id', auth, docController.deleteDocument);

module.exports = router;
