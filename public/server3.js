// CommonJS imports
const express = require('express');
var ipfs;

// Dynamic import for ES module
import('ipfs-http-client').then(ipfsHttpClient => {
  // Create an instance of IPFS
  ipfs = ipfsHttpClient.create({ url: 'http://localhost:5001' });
}).catch(error => {
  console.error('Failed to import ipfs-http-client:', error);
});

// Create an Express app
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.static("public"));
app.use(express.json({ extended: true })); // Use 'extended' option for URL-encoded data
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const upload = multer();

// Define route for adding a file to IPFS
app.post('/addFile', upload.single('file'), async (req, res) => {
  try {
    const fileContent = req.file.buffer; // Get file content from request

    const addedBuffer = await ipfs.add(fileContent);
    const cid = addedBuffer.cid; // Extract the CID string

    // Pin the added file for persistence
    await ipfs.pin.add(cid);
    console.log('File pinned:', cid);

    console.log(cid); // Added for reference
    res.json({ cid }); // Send CID as JSON response
  } catch (error) {
    console.error('Error adding file to IPFS:', error);
    res.status(500).json({ error: 'Error adding file to IPFS' });
  }
});

// Define routes and start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
