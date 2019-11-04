import ws from 'ws';

var wss = new ws.Server({ 
    port: 5000 
});
console.log('server started!')

wss.on('connection', (ws, req) => {
    console.log('ok')
});