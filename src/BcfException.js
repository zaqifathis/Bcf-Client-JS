
export class BcfException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'BcfException';
        this.statusCode = statusCode ?? -1;
    }
}