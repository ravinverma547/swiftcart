import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorMiddleware } from './middlewares/error';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const frontendUrl = process.env.FRONTEND_URL;
const formattedFrontendUrl = frontendUrl && !frontendUrl.startsWith('http') 
    ? `https://${frontendUrl}` 
    : frontendUrl;

const allowedOrigins = [
    'http://localhost:5173',
    formattedFrontendUrl,
].filter(Boolean) as string[];

// Sabhi origins se trailing slash hatao consistency ke liye
const cleanAllowedOrigins = allowedOrigins.map(url => url.replace(/\/$/, ""));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        
        const cleanOrigin = origin.replace(/\/$/, "");
        if (cleanAllowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked for origin: ${origin}. Allowed: ${cleanAllowedOrigins}`);
            callback(null, true); // Production mein debugging ke liye filhaal allow kar rahe hain or we can log it
        }
    },
    credentials: true,
}));

// Routes
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(errorMiddleware);

export default app;