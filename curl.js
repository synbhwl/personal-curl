// adding a user input feature 
const input = process.argv[2];

if (!input) {
    console.log('there were no arguments');
    process.exit(1);
}

// parsing the user input or req
const url = new URL(input);

const host = url.host;
const port = url.port || 80;
const path = url.path ||'/index.html';

// building a manual TCP connection
const net = require('net');
const client = net.createConnection({host: host, port:port}, ()=>{
    client.write(`GET ${path} HTTP/1.1\r\nHost: ${host}\r\nConnection: close`) //sending the req and asking it to close after done
});

// recieving the res
client.on('data', (chunk)=>{
    console.log(chunk.toString()); //parsing the req
});

//making sure the closing of the connection
client.on('end', ()=>{
    console.log('The connection has been closed successfully');
});

