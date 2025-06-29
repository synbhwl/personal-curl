
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

// info dictionary 
const info = {
    method: 'GET',
    headers: {},
    data: {}
};

//adding parsing for method and header 
const validMethods = ['GET', 'POST', 'PUT','DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

const custom = process.argv.slice(3);
for (let i=0; i < custom.length; i++){
    const flag = custom[i];
    const value = custom[i+1];
    if (!value) continue;

    if (flag === '--method' && value && validMethods.includes(value.toUpperCase()) == true){
        info.method = value.toUpperCase();
        i++;
    } else if (flag === '--header' && value){
        if (value.includes('&&')){
            const parts = value.split('&&');
            for (j=0; j <parts.length; j++){
                const {key, val} = parts[j].split(':');
                info.headers[key.trim()] = val.trim();
            };
        };
        const {key, val} = value.split(':');
        info.headers[key.trim()] = val.trim();
        i++;
    } else if (flag === '--data' && value){
        if (value.includes('&&')){
            const parts = value.split('&&');
            for (j=0; j <parts.length; j++){
                const {key, val} = parts[j].split('=');
                info.data[key.trim()] = val.trim();
            };
        };
        const {key, val} = value.split('=');
        info.data[key.trim()] = val.trim();
        i++;
    };
};


// building a manual TCP connection
const net = require('net');
const client = net.createConnection({host: host, port:port}, ()=>{
    client.write(`${info.method} ${path} HTTP/1.1\r\nHost: ${host}\r\nConnection: close`); //sending the req and asking it to close after done
});

// recieving the res
client.on('data', (chunk)=>{
    console.log(`Request:  ${info.method} ${path} HTTP/1.1\r\nHost: ${host}\r\nConnection: close\r\n`); 
    console.log(chunk.toString()); //parsing the req
});

//making sure the closing of the connection
client.on('end', ()=>{
    console.log('The connection has been closed successfully');
});

