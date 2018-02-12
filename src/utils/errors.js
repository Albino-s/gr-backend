import R, {compose as o} from 'ramda';

export const jail = f => async (...args) => {
  const [,, next] = args;
  try {
    await f(...args);
  } catch (error) {
    error.code = R.is(Number, error.code) ? error.code : 500;
    next(error);
  }
};

const untab = o(R.join(' '), R.map(R.trim), R.split(/\n/), R.defaultTo(''));

export const err = (message, code) => {
  const error = new Error(untab(message));
  error.code = code;
  return error;
};

export const notFound = message => err(message, 404);

export const notFoundError = notFound('Not found');

export const conflict = message => err(message, 409);

export const conflictError = conflict('Conflict');

export const invalidInput = message => err(message, 400);

export const invalidInputError = invalidInput('Invalid input');

export const forbidden = message => err(message, 403);

export const forbiddenError = forbidden('Forbidden');

export const tooManyRequests = message => err(message, 429);
