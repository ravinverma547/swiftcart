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

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Routes
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(errorMiddleware);

export default app;