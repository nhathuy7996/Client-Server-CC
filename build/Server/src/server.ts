import * as path from "path";  
import dotenv from "dotenv"; 
import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { sendDiscordNotification } from './discordConnector';
import { botTele, sendMessage as sendTeleMessage } from './teleConnector';
import { connectToCouchbase, queryData } from "./db/couchbaseClient";
import { authSocketToken } from './middleware/auth';
import { authAPIToken } from './middleware/auth';
import { handleSocketConnection } from './controllers/socketController';
import authRoutes from './routes/authTelegramRouter';
import privateExampleRouter from "./routes/privateExampleRouter";
import exampleRouter from './routes/publicExampleRouter';
import { createRedisAdapter } from './config/redis'; 
import fetch from 'node-fetch'; 
import { handleGamePlayEvents } from "./controllers/gamePlayController";
import schedule from 'node-schedule';


// Load environment variables
dotenv.config();

const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3103;
if (isNaN(HTTP_PORT)) {
    throw new Error('Invalid HTTP_PORT in environment variables');
}

const app: Express = express();
const httpServer = createServer(app);

// Khởi tạo Socket.IO với SSL
const initSocketIO = async () => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        // SSL Configuration
        transports: ['websocket', 'polling'],
        allowUpgrades: true,
        // Error handling
        connectTimeout: 45000,
        pingTimeout: 60000,
        pingInterval: 25000,
        // Cookie settings
        cookie: {
            name: 'io',
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    });

    // Socket.IO error handling
    io.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
    });

    io.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });

    // Socket.IO authentication middleware
    io.use(authSocketToken);

    // Socket.IO connection handling
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id, 'User:', socket.data.user);
        
        
        handleSocketConnection(socket);
        handleGamePlayEvents(socket,io);

        socket.on('disconnect', (reason) => {
            console.log('Client disconnected:', socket.id, reason);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return io;
};

// Express middleware
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
const publicPath = path.join(__dirname, "public");
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Routes
app.use('/api/auth', authRoutes);
app.get("/proxy-image", async (req, res) => {
    try {
        const imageUrl = req.query.url as string;
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();

        res.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");
        res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        res.status(500).send("Lỗi tải ảnh");
    }
});

app.use('/api/example', exampleRouter); // public API
//app.use('/api/example2', exampleRouter2);

//auth API
app.use('/api/authExample', authAPIToken, privateExampleRouter);


// Default route
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start server
try {
    initSocketIO().then(io => {
        httpServer.listen(HTTP_PORT, () => {
            console.log(`Server is running on http://localhost:${HTTP_PORT}`);
            console.log('Working directory:', __dirname);
            console.log('Public path:', publicPath);

            //sendDiscordNotification("Server up! 🚀");
            botTele;
        });
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}

//connectToCouchbase();


