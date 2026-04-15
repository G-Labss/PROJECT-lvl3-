const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    // expiresAt: {
    //     type: Date,
    //     required: true,

    // }
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Token', tokenSchema);