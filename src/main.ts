import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const HOST_NAME: string = '0.0.0.0';
const PORT: number = 9090;
const server = express();

// middleware
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan('combined'));

// route
server.use('/api', require('./router'));

server.listen(PORT, HOST_NAME, () => {
    console.info(`[info] server is running on port: ${PORT}`);
})
