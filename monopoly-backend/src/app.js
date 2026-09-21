import webRouter from './route.js';
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import connectDB from './config/db.js';
import { initWebSocket } from "./socket.js";

// 防止 WebSocket 解析异常导致进程崩溃
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/monopoly/api', webRouter);

//websocket — 必须在 app.listen() 之前注册
expressWs(app);
initWebSocket(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
