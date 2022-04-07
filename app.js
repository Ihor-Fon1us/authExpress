const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registrRouter = require('./routes/auth/registr');
const forgotPasswordRouter = require('./routes/auth/forgotPassword');
const loginRouter = require('./routes/auth/login');
const adminRouter = require('./routes/admin');
const loginController = require('./controller/loginController');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public/file/mc.exe', express.static(path.join(__dirname, 'public/file/mc.exe')));

app.use('/login', loginRouter);
app.use('/registr', registrRouter); 
app.use('/forgotPassword', forgotPasswordRouter);

app.use(loginController.loginController())

app.use('/', indexRouter)
app.use('/admin', adminRouter );
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
  
  // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;