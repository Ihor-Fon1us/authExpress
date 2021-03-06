const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/auth/register');
const forgotPasswordRouter = require('./routes/auth/forgotPassword');
const loginRouter = require('./routes/auth/login');
const adminRouter = require('./routes/admin');
const loginService = require('./services/loginService');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('file', express.static(path.join(__dirname, 'public/file')));

app.use('/login', loginRouter);
app.use('/register', registerRouter); 
app.use('/forgotPassword', forgotPasswordRouter);

app.use(loginService.loginService())

app.use('/', indexRouter)
app.use('/admin', adminRouter );
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
  
  // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;