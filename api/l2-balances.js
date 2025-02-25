import express from 'express';
import axios from 'axios';

const app = express();

app.get('/api/l2-balances', async (req, res) => {
    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
        return res.status(400).json({
            error: 'Valid wallet address is required',
            example: '/api/l2-balances?walletAddress=0xYourWalletAddress'
        });
    }

    try {
        const response = await axios.get(`https://blast-bridge.b-cdn.net/l2-balances?walletAddress=${walletAddress}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch balances' });
    }
});

// Add this at the end of the file, before the export
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the Express app for Vercel
export default app;