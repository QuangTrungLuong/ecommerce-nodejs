'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('./checkAuth')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const { NON_AUTHORITATIVE_INFORMATION } = require('../utils/reasonPhrases')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, secretKey) => {
    try {
        const accessToken = JWT.sign(payload, secretKey, {
            expiresIn: '2d'
        })

        const refreshToken = JWT.sign(payload, secretKey, {
            expiresIn: '7d'
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw error
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
    1. Check user_id missing 
    2. Get access token
    3. verify token
    4. check user in dbs
    5. check keyStore with this userId
    6. OK all -> return exits()
    */

    // check user_id missing 
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request!')

    // get access token
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found keyStore')

    //verify token

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    const authHeader = req.headers[HEADER.AUTHORIZATION]
    console.log('Authorization header:', authHeader)
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}