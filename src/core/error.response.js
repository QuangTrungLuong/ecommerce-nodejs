'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLIT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request',
    CONFLIT: 'Conflit error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message, status)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLIT, status = StatusCode.CONFLIT) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}


