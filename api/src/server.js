const express = require('express');
const api_routes = require('./routes');


const app = express();
const PORT = 80;

app.use('/', api_routes);

app.use(express.json());

app.get('/', (req,  res) => {
  res.json({message: 'server up'});
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));