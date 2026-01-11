'use strict'

const express = require('express')
const router = express.Router()


//check api key

//check permission

router.use('/v1/api', require('./access'))

// router.get('', (req, res, next) => {
//     return res.status(200).json({
//         message: 'welcome to my shop'
//     })
// })


module.exports = router