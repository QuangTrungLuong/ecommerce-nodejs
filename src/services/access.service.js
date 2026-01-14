'use strict'

const shopModel = require("../models/shop.model")
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITTER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {
    static signUp = async ({ name, email, password } = {}) => {
        // check email exits
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Erorr: Shop already registed!')
        }

        if (!name || !email || !password) {
            return {
                code: '400',
                message: 'Missing required fields'
            }
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        })

        if (newShop) {
            // created privateKey, publicKey
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,

                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },

                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })
            console.log({ privateKey, publicKey }) // save collection KeyStore

            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey
            })

            if (!publicKeyString) {
                throw new BadRequestError('Key Store Error')
            }

            console.log(`publicKeyString::`, publicKeyString)
            const publicKeyObject = crypto.createPublicKey(publicKeyString)
            console.log(`publicKeyObject::`, publicKeyObject)

            // created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey)
            console.log('Created token success::', tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService