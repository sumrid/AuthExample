const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const HOST_NAME = '0.0.0.0';
const PORT = 9090;
const server = express();

// middleware
server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
server.use(morgan('combined'));

// route
server.use('/api', require('./router'));

// start server
server.listen(PORT, HOST_NAME, () => {
    console.info(`[info] server is running on port: ${PORT}`);
});