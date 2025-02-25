import axios from 'axios';

export default async function handler(req, res) {
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
}
