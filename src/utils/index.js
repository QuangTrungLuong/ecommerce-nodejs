'use strict'

const _ = require('lodash')

const getInfoData = ({ fileds = [], objects }) => {
    return _.pick(objects, fileds)
}

module.exports = {
    getInfoData
}