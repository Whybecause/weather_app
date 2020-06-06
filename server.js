const express = require('express');
const server = express();

server.use(express.static('statique'));
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log('Server is running ! ');
});