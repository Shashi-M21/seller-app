import UnauthenticatedError from './unauthenticated.error.js';
import UnauthorisedError from './unauthorised.error.js';
import NoRecordFoundError from './no-record-found.error.js';
import DuplicateRecordFoundError from './duplicate-record-found.error.js';
import BadRequestParameterError from './bad-request-parameter.error.js';
import ConflictError from './conflict.error.js';
import PreconditionRequiredError from './precondition-required.error.js';

exports.UnauthenticatedError = UnauthenticatedError;
exports.UnauthorisedError = UnauthorisedError;
exports.NoRecordFoundError = NoRecordFoundError;
exports.DuplicateRecordFoundError = DuplicateRecordFoundError;
exports.BadRequestParameterError = BadRequestParameterError;
exports.ConflictError = ConflictError;
exports.PreconditionRequiredError = PreconditionRequiredError;
