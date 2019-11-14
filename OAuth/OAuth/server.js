const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, '/template')));

app.listen(8080, _ => console.log('listening'))