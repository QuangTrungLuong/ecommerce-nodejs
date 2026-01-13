'use strict'

const { findById } = require("../services/apikey.service")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}


// khai bao middleware api key
// chan request
// xac thuc
// gan du lieu vao request va respone
const apiKey = async (req, res, next) => {
    try {
        // lay apikey tu header
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // check object
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        res.objKey = objKey
        return next() // cho phep request di tiep

    } catch (error) {

    }
}

const permission = (permission) => {
    return (req, res, next) => {

        if (!req.objKey || !req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied"
            })
        }

        console.log("permissions::", req.objKey.permissions)

        const validPermission = req.objKey.permissions.includes(permission)

        if (!validPermission) {
            return res.status(403).json({
                message: "Permission Denied"
            })
        }

        next()
    }
}


module.exports = {
    apiKey,
    permission
}