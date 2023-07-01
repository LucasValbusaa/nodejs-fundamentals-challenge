export class FieldIsRequiredError extends Error {
    constructor(fieldName) {
        super(`${fieldName} is required`)
        this.name = 'Field Is Required Error'
    }
}