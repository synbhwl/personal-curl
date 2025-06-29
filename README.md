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

# day 2 29 june 2025
> thinking of adding something new, i am kind of confused about my learning framework and stuff.

**what do i add**
i have a few ways to make the thing better 
- i can add parsing for methods, headers and body too
- parse the same stuff from the response 
- i can make it compatible with https 
- add a saving to file system 

lets pick the first for today
**parsing for methods headers and body**
```
const method_input = process.argv[3]? process.argv[3].toUpperCase():undefined;
const validMethods = ['GET', 'POST', 'PUT','DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
const method = validMethods.includes(method_input)?method_input:'GET';
```
- so this fixed the parsing part to a few extent
- the first varible value is a conditional that stays if is process.argv[3] there/true? if yes then do this : if no then this;
- we made it undefined so that it doesnt throw an error
- next variable has an array containing the valid methods
- lastly method variable's value is also a similar conditional that says does the array include the input? if yes then method is the input or if it is false or undefined, its GET by default

*but this has a major problem*
- the position is fixed, which makes the position ususable for other things.
- what if the user doesnt wanna write custom method but just a custom header
- one way couldve been to add a ductape solution by making it a rule to write '/' for empty places but how would the user know which idx should be for what 
- so i researched a bit and found a much better way

```
const validMethods = ['GET', 'POST', 'PUT','DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
let method = 'GET';

const custom = process.argv.slice(3);
for (let i=0; i < custom.length; i++){
    if (custom[i] === '--method' && custom[i+1] && validMethods.includes(custom[i+1].toUpperCase()) == true){
        method = custom[i+1].toUpperCase();
    };
};
```
- added some of my own logic to the thing
- array stays the same
- i initialised a method with 'get' as default as a fallback if the if statement never shoots
- process.argv.slice(3) takes out the first 3 things from the input
- custom[i] === '--method' && custom[i+1] && validMethods.includes(custom[i+1].toUpperCase()) == true - this basically checks whether and if there is a --method command written and a next command written that is in the damn array, make that as the method 
- *also i reaslied that there is a dictionary way to do it* so let me research a bit about that as well

**dictionary way of doing it?**
```
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
        const {key, val} = value.split(':');
        info.headers[key.trim()] = val.trim();
        i++;
    } else if (flag === '--data' && value){
        const {key, val} = value.split('=');
        info.data[key.trim()] = val.trim();
        i++;
    };
};
```
notes on this 
- first we made a dict that stores these dynamic value 
- the valid method array is still there
- we start with the 4th argument 
- we make the i the flag i.e the first argument and i+1 the value 
- we say that even if there are no values move frwrd and do nothing 
- we check if the flag is method and if it is and is a valid method, we put it inside thr dict and we increment the i to go one idx ahead and the loop restarts 
- and checks whether the flag is header and if it is and the value is there, it splits the value by ":" and stores them as a pair of key and value and finally puts them into the dictionary 
- same for data but split by '='

*but then, it has to be added into the manual request too*

*but here is a problem as well, what if the user tries to add multiple headers or data*
```
        if (value.includes('&&')){
            const parts = value.split('&&');
            for (j=0; j <parts.length; j++){
                const {key, val} = parts[j].split(':');
                info.headers[key.trim()] = val.trim();
            };
        };
```
- i did a double split and added t inside the actual else if statement and i did the same to handle multiple data
- i am not happy with it because of the circuler logic, lack of reusability and lack of data flow design
- i think i will call it a day for today, i am also realising that i must do DSA 
- ill also get started with a new project in a few days to learn more 
