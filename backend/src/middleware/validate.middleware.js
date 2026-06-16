const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

// Validates req.body / req.query / req.params against a Zod schema.
// On success, replaces the request parts with the parsed (and coerced) values.
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.validatedQuery = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;
    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      return next(ApiError.badRequest('Validation failed', details));
    }
    return next(err);
  }
};

module.exports = validate;
