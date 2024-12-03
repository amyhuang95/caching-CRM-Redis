import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import { rootRouter } from './routes/root.js';
import { employeeRouter } from './routes/employee.js';
import { customerRouter } from './routes/customer.js';

// Resolve file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up the express app
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up view directory
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Add routes
app.use(rootRouter);
app.use(employeeRouter);
app.use(customerRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
