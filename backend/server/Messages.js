function MessageResponse (type, failure, statusCode, statusText) {
    this.type = type
    this.failure = failure
    this.statusCode = statusCode
    this.statusText = statusText
}

function SuccessResponse (statusCode, statusText) {
    MessageResponse.apply(this, [statusCode, statusText])
    this.type = 'Success'
    this.failure = false
}

function ErrorResponse (statusCode, statusText) {
    MessageResponse.apply(this, [statusCode, statusText])
    this.type = 'Error'
    this.failure = true
}

module.exports = {
    MessageResponse,
    SuccessResponse,
    ErrorResponse
}