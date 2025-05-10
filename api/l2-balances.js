import express from 'express';
import axios from 'axios';

const balancesRouter = express.Router();

// Test function to verify API behavior
// async function testApiWithDifferentAddresses() {
//     const testAddresses = [
//         '0x0000000000000000000000000000000000000000', // Zero address
//         '0x000000000000000000000000000000000000dEaD', // Dead address
//         '0x0000000000000000000000000000000000000001'  // Another test address
//     ];

//     console.log('=== Testing API with different addresses ===');
    
//     for (const address of testAddresses) {
//         try {
//             const response = await axios.get(`https://blastcdn.b-cdn.net/l2-balances?walletAddress=${address}`, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'User-Agent': 'Mozilla/5.0'
//                 }
//             });
//             console.log(`\nResults for address ${address}:`);
//             console.log('Status:', response.status);
//             console.log('Data:', JSON.stringify(response.data, null, 2));
//         } catch (error) {
//             console.error(`Error testing address ${address}:`, error.message);
//         }
//     }
// }

// // Run the test when the server starts
// testApiWithDifferentAddresses();

balancesRouter.get('/l2-balances', async (req, res) => {
    const { walletAddress } = req.query;
    const requestTime = new Date().toISOString();
   
    if (!walletAddress || typeof walletAddress !== 'string') {
        return res.status(400).json({
            error: 'Valid wallet address is required',
            example: '/l2-balances?walletAddress=0xYourWalletAddress'
        });
    }

    const cleanAddress = walletAddress.trim().toLowerCase();
    if (!cleanAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return res.status(400).json({
            error: 'Invalid wallet address format',
            details: 'Address must be a valid Ethereum address starting with 0x followed by 40 hexadecimal characters'
        });
    }
    
    const requestUrl = `https://blastcdn.b-cdn.net/l2-balances?walletAddress=${cleanAddress}`;
    console.log('=== Request Details ===');
    console.log('Timestamp:', requestTime);
    console.log('Original Wallet Address:', walletAddress);
    console.log('Cleaned Wallet Address:', cleanAddress);
    console.log('Request URL:', requestUrl);
    
    try {
        console.log('Sending request to external API...');
        const response = await axios.get(requestUrl, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Requested-With': 'XMLHttpRequest'
            },
            // Add timeout and validate status
            timeout: 10000,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept all responses to handle them properly
            }
        });
        
        console.log('=== Response Details ===');
        console.log('Status:', response.status);
        console.log('Headers:', JSON.stringify(response.headers, null, 2));
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
        // Check if response is from cache
        const isCached = response.headers['cf-cache-status'] === 'HIT' || 
                        response.headers['x-cache'] === 'HIT' ||
                        response.headers['x-cache-status'] === 'HIT';
        
        if (isCached) {
            console.log('WARNING: Response was served from cache!');
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('=== Error Details ===');
        console.error('Error Message:', error.message);
        console.error('Error Status:', error.response?.status);
        console.error('Error Headers:', error.response?.headers);
        console.error('Error Data:', error.response?.data);
        
        if (error.response?.status === 400) {
            return res.status(400).json({ 
                error: 'Invalid wallet address',
                details: error.response.data
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch balances',
            details: error.message
        });
    }
});

export default balancesRouter;
