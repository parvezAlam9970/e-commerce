const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const morgan = require('morgan');
const HttpStatus = require('http-status-codes');
const Response = require('../utilities/Response');
const router = require('../api');
const multer = require('multer');

module.exports = ({ app }) => {
  app.enable('trust proxy');

  // HTTP request logger
  app.use(morgan('dev'));

  // Enable Cross Origin Resource Sharing
  app.use(cors({ origin: '*' }));

  // const upload = multer(); // Default memory storage
  // app.use(upload.any());

  // Allow using HTTP verbs such as PUT or DELETE where client doesn't support it
  app.use(methodOverride());

  // Middleware to parse JSON bodies
  app.use(bodyParser.json({ limit: '100mb', type: 'application/json' }));

  // Load API routes
  router(app);

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error(`Route ${req.url} Not Found`);
    err.status = HttpStatus.StatusCodes.NOT_FOUND;
    next(err);
  });

  // Error handlers
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return Response.fail(res, err.message, err.status);
    }

    if (err.name === 'MulterError') {
      return Response.fail(res, err.message, HttpStatus.StatusCodes.UNPROCESSABLE_ENTITY);
    }

    return Response.fail(res, err.message, err.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
  });

  app.use((err, req, res) => {
    res.status(err.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
