import express from 'express';
import bodyParser from 'body-parser';
import balancesRouter from './api/l2-balances.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.set('trust proxy', true);
// Use CORS middleware
app.use(cors());

// Use the anything-tg-bot routes
app.use('/api', balancesRouter);

// Display welcome message on the page
app.get('/', (req, res) => {
    res.send('Welcome to Blast Backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});