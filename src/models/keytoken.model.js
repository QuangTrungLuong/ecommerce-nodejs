'use strict'

const { Schema, model, default: mongoose } = require('mongoose');

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array, // nhung RT đã được sử dụng
        default: []
    },
    refreshToken: { type: String, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// export module 
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);