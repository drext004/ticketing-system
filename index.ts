import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './route';
import http from 'http';
import { Server } from 'socket.io';



const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE"],
    }
});

app.use(cors());

app.use(express.json());

app.use('/api', router);

server.listen(3000, () => console.log('Server running on port 3000'));

