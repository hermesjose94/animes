//Librerias instaladas
const express = require('express');
const favicon = require('express-favicon');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
//Librerias propias
const authApi = require('./api/routes/auth');
const animesApi = require('./api/routes/animes');
const usersApi = require('./api/routes/users');
const userAnimesApi = require('./api/routes/userAnimes');
const config = require('./api/config/index');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./api/utils/middleware/errorHandlers');
const notFoundHandler = require('./api/utils/middleware/notFoundHandler');

const app = express();

// parse application/json
app.use(express.json());
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(config.authCookieSecret));

//Routes API
authApi(app);
animesApi(app);
usersApi(app);
userAnimesApi(app);

//Carga de la APP
app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
  return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Catch 404
app.use(notFoundHandler);

//Error middlewares
//logErrors
app.use(logErrors);
//Boom
app.use(wrapErrors);
//errorHandler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`);
});
