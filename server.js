// CommonJS import
const express = require('express');
var ipfs;
// Dynamic import for ES module
import('ipfs-http-client').then(ipfsHttpClient => {
  // Create an instance of IPFS
 ipfs = ipfsHttpClient.create({ url: 'http://localhost:5001' });
  // Proceed with using 'ipfs'
}).catch(error => {
  console.error('Failed to import ipfs-http-client:', error);
});

// Create an Express app
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded())
var path=require("path")
var options={
    root:path.join(__dirname)
}
const multer = require('multer');
const upload = multer();

//we can get image by using https://ipfs.io/ipfs/cid
//lpublic  https://docs.ipfs.tech/concepts/ipfs-gatewa
//local http://localhost:8080/ipfs/Qmbm7Fz7PnRB3fgJisQtFuP3socd7PQND5QfX5ay3ym65b


// Define route for adding a file to IPFS
app.post('/addFile', upload.single('file'), async (req, res) => {
    try {
      const fileContent = req.file.buffer; // Get file content from request
      const  cid  = await ipfs.add(fileContent);
     
      console.log(cid) // Add file to IPFS without specifying a path
      res.json({ cid }); // Send CID as JSON response
    } catch (error) {
      console.error('Error adding file to IPFS:', error);
      res.status(500).json({ error: 'Error adding file to IPFS' }); // Send error response
    }
  });



// Define routes and start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});