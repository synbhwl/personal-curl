# personal-curl (Node.js)

A minimal cURL-like CLI tool built from scratch using low-level Node.js modules. This project was built to deepen understanding of HTTP, TCP sockets, and request/response handling without using high-level abstractions like `axios` or `fetch`.

## Overview

This tool performs a manual HTTP request over a TCP connection using Node.js’s built-in `net` module. It allows the user to:

- Input a target URL from the command line
- Specify HTTP methods (e.g. GET, POST)
- Send custom headers and data
- View the raw HTTP response from the server

## Features

- Manual TCP socket connection using `net`
- Basic URL parsing with the built-in `URL` class
- CLI argument parsing via `process.argv`
- Supports:
  - `--method` flag (default is GET)
  - `--header` flag (`key:value`, supports multiple with `&&`)
  - `--data` flag (`key=value`, supports multiple with `&&`)
- Manual request construction and response logging
- Graceful connection termination and logging

## Limitations 
- The parsing hasn't been synced with the manual request string yet. 