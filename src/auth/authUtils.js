'use strict'
const JWT = require('jsonwebtoken')
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


module.exports = {
    createTokenPair
}