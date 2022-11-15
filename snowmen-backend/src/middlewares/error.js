const _ = require('lodash');
const Boom = require('@hapi/boom');

const notFoundErrorHandler = (req, res, next) => {
  throw Boom.notFound('Route Not Found');
};

const globalErrorHandler = (error, req, res, next) => {
  try {
    let code = error?.status ?? 500;
    let responseMsg = error?.message ?? 'Internal server error, please contact service developer to resolve it!';
    const { headers, query, params, body, url, method, signedCookies, cookies, user } = req;
    const log = {
      meta: {
        headers,
        query,
        params,
        body,
        url,
        method,
        signedCookies,
        cookies,
        user,
        userId: user?._id?.toString(),
      },
    };

    if (_.get(error, 'error.isJoi')) {
      code = 400;
      responseMsg = _.get(error, 'error.details');
    }

    if (error.isBoom) {
      // pull code and responseMsg from the Boom error object
      code = error.output.payload.statusCode;
      responseMsg = error.output.payload.message;
    }

    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      code = 400;
      responseMsg = _.get(error, 'message');
    }

    log.message = responseMsg;
    log.code = code;
    log.stack = error.stack;

    if (code >= 500) {
      console.log(log);
    } else {
      console.log(log);
    }
    res.status(code).json({ error: responseMsg });
  } catch (e) {
    res.status(500).json({ code: 500 });
  }
};

module.exports = {
  notFoundErrorHandler,
  globalErrorHandler,
};
