const express = require('express');
const app = express();
var fs = require('fs');

const path = require('path');
app.use(express.static(path.join(__dirname, '/template')));

// app.listen(8080, _ => console.log('listening'))

var https = require('https');

var certOptions = {
  key: fs.readFileSync(path.resolve('./cert/server.key')),
  cert: fs.readFileSync(path.resolve('./cert/server.crt'))
}
var server = https.createServer(certOptions, app).listen(443)
console.log('listening 443')