const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/l2-balances', async (req, res) => {
    const { walletAddress } = req.query;

    if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
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

const app = express();
const PORT = process.env.PORT || 3000; // Common pattern: use environment variable or default to 3000

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
