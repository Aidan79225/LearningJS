const http = require('http')
const hostname = 'localhost' //127.0.0.1
const port = 3000
const server = http.createServer((req, res) => {
    // Do something to handle request and response here
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('hello world!')
})

server.listen(port, hostname, () => {
    console.log(`1st node.js server running on http://${hostname}:${port}`)
})