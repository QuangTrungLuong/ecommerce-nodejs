'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

const apiKeySchema = new Schema({
    key: {
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permission: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: '30d'
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
});