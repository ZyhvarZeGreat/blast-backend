import express from 'express';
import axios from 'axios';

const balancesRouter = express.Router();

balancesRouter.get('/l2-balances', async (req, res) => {
    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
        return res.status(400).json({
            error: 'Valid wallet address is required',
            example: '/l2-balances?walletAddress=0xYourWalletAddress'
        });
    }

    try {
        const response = await axios.get(`https://blastcdn.b-cdn.net/l2-balances?walletAddress=${walletAddress}`, {
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

export default balancesRouter;
