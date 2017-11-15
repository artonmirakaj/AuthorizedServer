// main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB setup, creates a new database inside mongodb called auth
mongoose.connect('mongodb://localhost:auth/auth');

// App setup, Middleware
app.use(morgan('combined')); // logging framework - logging incoming requests, debugging
app.use(bodyParser.json({ type: '*/*' })); // parse incoming requests into JSON
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);

