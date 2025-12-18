const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const doc = new Document({
            name: req.body.name || req.file.originalname,
            path: req.file.path,
            type: req.file.mimetype,
            owner: req.user.id
        });

        await doc.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const docs = await Document.find({ owner: req.user.id });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, owner: req.user.id });
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Delete file from disk
        fs.unlinkSync(doc.path);

        await Document.deleteOne({ _id: req.params.id });
        res.json({ message: 'Document deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
