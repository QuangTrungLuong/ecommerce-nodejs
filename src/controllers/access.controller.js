'use strict'

const { CREATED } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        //console.log(`[P]::signUp::`, req.body)
        /*
        200 - ok
        201 - created
        */
        new CREATED({
            message: 'Registed ok!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new AccessController()

