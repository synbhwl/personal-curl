# getting started with backend 

**some notes** 
- honestly ik almost nothingabout backend as of now that i am starting this 
- my framework is just asking finding out the next step, asking gpt or google how to do it and then research decently about each line deeply 

s# DAY 1 JUNE 28 2025 
so apparantly i asked gpt for a first sequence of steps to get me started and it just told me a geneal req res cycle i guess
1. Parse the user inputs (gotta init variables for this)
2. build a manual TCP connection (socket i.e)
3. send HTTP req 
4. get the response 
5. parse the res
6. manually close the  connection (why manually tho?)

## node notes 
we have to initialise a few things beforehand. 
port, host, protocol, path etc 
- we can either hardcode them manually which i actually tried ngl
- or we can just use the new URL helper object. its a built in class whatever that means. god its good man 

```
const url = new URL("http://example.com");

const host = url.host;
const port = url.port || 80;
const path = url.path ||'/';
```
- "/" is the root path. path means the location of the info that i want. when u are sure you write a specific path but otherwise leave it root 

**after we have parsed the input, we have to make a manual TCP socket now wth the damn server**
```
const net = require('net');
const client = net.createConnection({host: host, port:port}, ()=>{
    client.write(`GET ${path} HTTP/1.1\r\nHost: ${host}\r\nConnection: close`)
});
```
**here we are taking the help of a low level module to make a connection**
- we first import the thing
- we then use the createConnection method
- one argument is a literal {path, port} - do not add anything because this is only writen to build a socket 
- the other arg is a callback arrow func that says 
- client.write which means sending bytes over this socket. 
- we are sending a string that looks exactly like a http req

**now that we have sent the thing we need to first recieve the res**
```
client.on('data', (chunk)=>{
    console.log(chunk.toString());
});
```
- we have used the .on method here - think of it exactly like a event listener in DOM 
- the 'data' is actually the name of the event and it means - the bytes that come through the socket
- we pass a param in the callback as chunk which is actually the bytes being recieved
- finally we are seeing it by converting it into a string 

**making sure the connection is closed**
```
client.on('end', ()=>{
    console.log('The connection has been closed successfully');
});
```
- we already asked the http to close the socket once the res is recieved in the damn header 
- but just to make sure, we logged in that it really is closed

**congrats we have already made a stone age version of curl**
- it only takes hardcoded url now so now i wanna add a user input version of it

**now i want**
- such that the user (me) cam write node curl.js urlname and it'll do the same thing

```
const input = process.argv[2];

if (!input) {
    console.log('there were no arguments');
    process.exit(1);
};
```
what happend here 
- we are taking an input 
- the file is called the script when the inside content in it is just programmes waiting to be executed
- in the process of being executed it becomes a process
- when we say arg it means arguments and v means vector meaning an array
- when we say [2] we mean the 2 idx in the array 
- together it picks up the 2nd idx in the argument in the user input 
- node curl.js http://example.com it takes up the url is the 2nd idx and stores it into the input
- process.exit(1) just stops running the script and 1 means something went wrong, like a OS code

*note- if u r wondering how the user's input is the process, node basically considers the arg also within the process context once u hit enter*
