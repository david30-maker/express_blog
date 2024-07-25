const express = require('express');
const User = require('../models/user');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/profile', upload.single('profilePicture'), async (req, res) => {
    const user = await User.findById(req.user._id);
    if (req.file) {
        user.profilePicture = `/uploads/${req.file.filename}`;
    }
    await user.save();
    res.redirect('/profile');
});

module.exports = router;