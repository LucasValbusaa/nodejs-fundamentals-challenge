export function formattedError(error, statusCode) {
    return {
        error: error.name,
        message: error.message,
        status: statusCode,
    }
}