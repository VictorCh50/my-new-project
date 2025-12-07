const express = require('express'); // #A
const app = express(); // #B
const port = 3000; // #C

app.get('/', (req, res) => { // #D
  res.send('Hello World!'); // #E
});

app.listen(port); // #F
